from fastapi import FastAPI, UploadFile, File,Form, HTTPException
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from ats_module.utils.db import connect_to_mongo, disconnect_from_mongo
from ats_module.utils.resume_processor import parse_resume
from ats_module.utils.jd_processor import parse_jd
from ats_module.utils.repository import ApplicantRepository,JDRepository
from ats_module.utils.cloudinary_upload import upload_file
from ats_module.utils.email_service import send_rejection_email
from ats_module.models.rejection_email_model import RejectionRequest

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
        try:
            upload_result = await upload_file(
            file_bytes=file_bytes,
            file_name=file.filename,
            folder="resumes"
        )
            resume_url = upload_result["secure_url"]
            # resume_public_id = upload_result["public_id"]
            # resume_format = upload_result["format"]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Cloudinary upload failed: {str(e)}")

        # Parse resume with LLM
        parsed_resume = parse_resume(file_bytes)  # returns Resume object

        # # ✅ DEBUG: Print the experience value to console
        print("=" * 50)
        print("DEBUG - PARSED RESUME EXPERIENCE:")
        print(f"Candidate Name: {parsed_resume.name}")
        print(f"Total Experience: {parsed_resume.total_experience} years")  # Changed to total_experience
        print(f"Experience Type: {type(parsed_resume.total_experience)}")
        print(f"Work Experience entries: {len(parsed_resume.experience)}")

        # If work experience exists, print details
        if parsed_resume.experience:
            for i, exp in enumerate(parsed_resume.experience):
                print(f"  Work {i+1}: {exp.company} - {exp.role} - {exp.duration}")
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
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400,detail="Only Pdf files are Allowed")
        
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
        parsed_jd=await parse_jd(file_byte)
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


@app.post("/send-rejection-email")
async def send_rejection_email_api(request: RejectionRequest):
    success = await send_rejection_email(request.email, request.name, request.position)
    
    if success:
        return {"message": f"Rejection email sent successfully to {request.email}"}
    else:
        raise HTTPException(status_code=500, detail="Failed to send rejection email.")