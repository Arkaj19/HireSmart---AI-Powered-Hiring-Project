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
from fastapi import Response, Depends
from typing import Optional
from ats_module.models.testresult import TestResultModel

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
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*"
    ],
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
async def upload_jd(
    file:UploadFile=File(...),
    department: str = Form(...),
    experience_range: str = Form(...)
):
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

        jd_dept=department
        jd_experience_range=experience_range

        jd_id=await jd_repo.add_jd(
            jd=parsed_jd,
            jd_filename=file.filename,
            jd_url=jd_url,  # Pass the Cloudinary URL   
            jd_dept=jd_dept,
            jd_experience_range=jd_experience_range
        )
        return { 
            "message": "JD processed and stored successfully",
            "jd_name":parsed_jd.job_title,
            "jd_dept":jd_dept,
            "jd_experience_range":jd_experience_range,
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
    
@app.get("/jds")
async def get_all_jd():
    try:
        jds = await jd_repo.get_all_jds()
        return jds
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Repository error: {e}")


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
        test_link = "https://forms.gle/QcNLqSopYNKnvGq27"
        success = await send_shortlist_email(
            request.email, 
            request.name, 
            request.position
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


## Code for the Login and Signup
from ats_module.auth.auth_models import RegisterModel, LoginModel, UserOut
from ats_module.auth.auth_utils import (
    hash_password, verify_password,
    create_access_token, get_current_user
)
from ats_module.auth.auth_repository import (
    find_user_by_email, find_user_by_employeeId,
    create_user, find_user_by_id
)

@app.post("/auth/register")
async def register_user(
    email: str = Form(...),
    employeeId: str = Form(...),
    phone: str = Form(...),
    name: str = Form(...),
    password: str = Form(...),
    designation: str = Form(...),
    file: Optional[UploadFile] = File(None)
):
    # Check unique email
    existing = await find_user_by_email(email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    # Check unique employeeId
    existing_eid = await find_user_by_employeeId(employeeId)
    if existing_eid:
        raise HTTPException(status_code=400, detail="Employee ID already exists")

    # Upload image to Cloudinary (optional)
    photo_url = None
    if file and file.filename:   # <-- Additional check!
        file_bytes = await file.read()
        upload_res = await upload_file(
            file_bytes,
            file.filename,
            folder="profile_photos"
        )
        photo_url = upload_res["secure_url"]


    user_doc = {
        "email": email,
        "employeeId": employeeId,
        "password": hash_password(password),
        "phone": phone,
        "name": name,
        "designation": designation,
        "profile": {"photo": photo_url}
    }

    inserted_id = await create_user(user_doc)

    return {"success": True, "message": "Account created", "userId": inserted_id}


@app.post("/auth/login")
async def login(response: Response,
                email: str = Form(...),
                employeeId: str = Form(...),
                password: str = Form(...)):
    
    user = await find_user_by_email(email)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect credentials")

    if user["employeeId"] != employeeId:
        raise HTTPException(status_code=400, detail="Employee ID mismatch")

    if not verify_password(password, user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect password")

    token = create_access_token({"user_id": str(user["_id"])})

    # response.set_cookie(key="token", value=token, httponly=True, samesite="Strict", max_age=86400)
    # ✅ Fix (for production with separate frontend):
    response.set_cookie(
        key="token", 
        value=token, 
        httponly=True, 
        secure=True,  # ✅ Add this for HTTPS
        samesite="None",  # ✅ Required for cross-site cookies
        max_age=86400,
        domain=".onrender.com"  # ✅ Optional: if both on same domain
    )

    return {
        "success": True,
        "message": f"Welcome {user['email']}",
        "user": {
            "_id": str(user["_id"]),
            "email": user["email"],
            "employeeId": user["employeeId"],
            "name": user.get("name"), #Added for name
            "designation": user.get("designation"),
            "phone": user.get("phone"),
            "profile": user.get("profile", {})
        }
    }


@app.get("/auth/me")
async def get_me(payload=Depends(get_current_user)):
    user_id = payload["user_id"]
    user = await find_user_by_id(user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "success": True,
        "user": {
            "_id": str(user["_id"]),
            "email": user["email"],
            "employeeId": user["employeeId"],
            "name": user.get("name"), #Added 
            "phone": user.get("phone"),
            "designation": user.get("designation"),
            "profile": user.get("profile", {})
        }
    }


@app.get("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("token")
    return {"success": True, "message": "Logged out"}

@app.post("/update-test-score")
async def update_test_score(payload: TestResultModel):
    try:
        print("🔥 Incoming test result:", payload.dict())

        # Update DB entry
        updated = await repo.update_test_score(
            email=payload.email,
            score=payload.score,
            status=payload.status
        )

        if not updated:
            raise HTTPException(status_code=404, detail="Candidate not found")

        return {
            "success": True,
            "message": f"Test results updated for {payload.email}",
            "score": payload.score,
            "status": payload.status
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))