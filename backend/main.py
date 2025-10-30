from fastapi import FastAPI, UploadFile, File,Form, HTTPException
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from ats_module.utils.db import connect_to_mongo, disconnect_from_mongo
from ats_module.utils.resume_processor import parse_resume
from ats_module.utils.jd_processor import parse_jd
from ats_module.utils.repository import ApplicantRepository,JDRepository
from ats_module.utils.cloudinary_upload import upload_file
from ats_module.utils.email_service import send_rejection_email, send_shortlist_email
from ats_module.models.rejection_email_model import RejectionRequest
from ats_module.models.shortlist_email_model import ShortlistRequest

# --- Startup / Shutdown events ---S
@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup ---
    await connect_to_mongo()
    
    yield  # yield marks the point between startup and shutdown.
    
    # --- Shutdown ---
    await disconnect_from_mongo()

app = FastAPI(lifespan=lifespan)

# --- Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Repository ---
repo = ApplicantRepository()
jd_repo=JDRepository()

# --- Upload endpoint ---
@app.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    position_id:int=Form(...)
):
    try:
        # Check file type
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

        # Read file bytes
        file_bytes = await file.read()
        #upload jd in cloudinary
        try:
            upload_result = await upload_file(
            file_bytes=file_bytes,
            file_name=file.filename,
            folder="resumes"
        )
            resume_url = upload_result["secure_url"]#secure_url is a KV pair in the dict returned by cloudinary_upload method
            # resume_public_id = upload_result["public_id"]
            # resume_format = upload_result["format"]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Cloudinary upload failed: {str(e)}")

        # Parse resume with LLM
        parsed_resume = parse_resume(file_bytes)  # returns Resume object

        # ✅ DEBUG: Print the experience value to console (updated to new model fields)
        print("=" * 50)
        print("DEBUG - PARSED RESUME EXPERIENCE:")
        print(f"Candidate Name: {getattr(parsed_resume, 'candidate_name', '')}")
        print(f"Total Experience: {getattr(parsed_resume, 'total_experience_years', getattr(parsed_resume, 'total_experience', ''))} years")
        print(f"Experience Type: {type(getattr(parsed_resume, 'total_experience_years', getattr(parsed_resume, 'total_experience', None)))}")
        # work_experience in new model
        work_exps = getattr(parsed_resume, 'work_experience', []) or getattr(parsed_resume, 'experience', [])
        print(f"Work Experience entries: {len(work_exps)}")

        # If work experience exists, print details
        if work_exps:
            for i, exp in enumerate(work_exps):
                # new WorkExperience has job_title and company_name
                company = getattr(exp, "company_name", getattr(exp, "company", ""))
                role = getattr(exp, "job_title", getattr(exp, "role", ""))
                duration = f"{getattr(exp, 'start_date', '')} - {getattr(exp, 'end_date', '')}" if (getattr(exp, 'start_date', None) or getattr(exp, 'end_date', None)) else getattr(exp, "duration", "")
                print(f"  Work {i+1}: {company} - {role} - {duration}")
        print("=" * 50)  

        # Save to MongoDB
        candidate_id = await repo.add_candidate(
            resume=parsed_resume,
            match_result=None,  # Will be calculated inside add_candidate
            resume_filename=file.filename,
            resume_url=resume_url,  # ✅ Pass the Cloudinary URL
            position_id=position_id  # Don't convert to string, it's already int
            )

        return { 
            "message": "Resume processed and stored successfully",
            "candidate_id": candidate_id,
            "candidate_name": parsed_resume.name,
            "position_id": position_id,
            "resume_url": resume_url
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload error: {e}")
    
# ---Upload JD ---
@app.post("/uploadjd")
async def upload_jd(file:UploadFile=File(...)):
    try:
        allowed_extensions = (".pdf", ".docx")
        if not file.filename.lower().endswith(allowed_extensions):
            raise HTTPException(status_code=400,detail="Only Pdf or word Files are allowed")
        
        file_byte=await file.read()
        try:
            upload_jd=await upload_file(
                file_bytes=file_byte,
                file_name=file.filename,
                folder ="job_descriptions"
            )
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Cloudinary upload failed: {str(e)}")
        
        #Parse jd with LLM
        parsed_jd=await parse_jd(file_byte,file.filename)
        jd_url=upload_jd["secure_url"]

        jd_id=await jd_repo.add_jd(
            jd=parsed_jd,
            jd_filename=file.filename,
            jd_url=jd_url,  # Pass the Cloudinary URL   
        )
        return { 
            "message": "JD processed and stored successfully",
            "jd_id": jd_id,
            "jd_url": jd_url
        }
    

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"JD upload error: {str(e)}")

# --- Fetch all candidates ---
@app.get("/candidates")
async def get_all_candidates():
    try:
        candidates = await repo.get_all_candidates()
        return candidates
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Repository error: {e}")


# @app.post("/send-rejection-email")
# async def send_rejection_email_api(request: RejectionRequest):
#     try:
#         success = await send_rejection_email(request.email, request.name, request.position)

#         if not success:
#             raise HTTPException(status_code=500, detail="Failed to send the Rejection Email")
        
#         updated = await repo.mark_rejection_sent(request.candidate_id)
#         # This is calling the mark_rejection_sent function in the repository.py to update that parameter to true for that candidate

#         if not updated:
#             raise HTTPException( status_code=500, detail="Candidate not found or update failed")
        
#         return{
#             "message": f"Rejection email sent successfully to {request.email}",
#             "status": "updated"
#         }
    
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=F"Error sending the rejection email: {e}")

@app.post("/send-rejection-email")
async def send_rejection_email_api(request: RejectionRequest):
    try:
        print(f"🔵 Starting rejection email process for candidate: {request.candidate_id}")
        
        success = await send_rejection_email(request.email, request.name, request.position)
        print(f"📧 Email send result: {success}")

        if not success:
            print("❌ Email failed, raising exception")
            raise HTTPException(status_code=500, detail="Failed to send the Rejection Email")
        
        updated = await repo.mark_rejection_sent(request.candidate_id)
        print(f"💾 Database update result: {updated}")

        if not updated:
            print("❌ Database update failed, raising exception")
            raise HTTPException(status_code=500, detail="Candidate not found or update failed")
        
        print("✅ Success! Returning success response")
        return {
            "message": f"Rejection email sent successfully to {request.email}",
            "status": "updated"
        }
    
    except HTTPException:
        print("⚠️ Re-raising HTTPException")
        raise
    except Exception as e:
        print(f"❌ Caught unexpected exception: {e}")
        raise HTTPException(status_code=500, detail=f"Error sending the rejection email: {str(e)}")
    


@app.post("/send-shortlist-email")
async def send_shortlist_email_api(request: ShortlistRequest):
    try:
        print(f"🔵 Starting shortlist email process for candidate: {request.candidate_id}")
        
        # Optional: Add test link logic here
        # test_link = "https://your-test-platform.com/test/12345"
        test_link = None  # or generate/fetch from somewhere
        
        success = await send_shortlist_email(
            request.email, 
            request.name, 
            request.position,
            test_link
        )
        print(f"📧 Email send result: {success}")

        if not success:
            print("❌ Email failed, raising exception")
            raise HTTPException(status_code=500, detail="Failed to send the Shortlist Email")
        
        updated = await repo.mark_test_sent(request.candidate_id)
        print(f"💾 Database update result: {updated}")

        if not updated:
            print("❌ Database update failed, raising exception")
            raise HTTPException(status_code=500, detail="Candidate not found or update failed")
        
        print("✅ Success! Returning success response")
        return {
            "message": f"Shortlist email sent successfully to {request.email}",
            "status": "updated"
        }
    
    except HTTPException:
        print("⚠️ Re-raising HTTPException")
        raise
    except Exception as e:
        print(f"❌ Caught unexpected exception: {e}")
        raise HTTPException(status_code=500, detail=f"Error sending the shortlist email: {str(e)}")