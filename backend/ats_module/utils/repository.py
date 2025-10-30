from datetime import datetime, timezone
from dateutil.relativedelta import relativedelta
from dateutil.parser import parse as parse_date
from ats_module.models.resume_model import ResumeExtractedData
from ats_module.models.jd_model import  JDExtractedData
from ats_module.models.match_result_model import MatchResult
from ats_module.utils.db import applicants_collection,job_description_collection
from ats_module.utils.ats_scorer import compare_resume_with_jd
import re


#--------------------Get position title from position id --------------------------------------
async def get_position_id()->int:
    last_jd = await job_description_collection.find_one(
        sort=[("position_id", -1)]  # sort descending by position_id
    )
    if last_jd and "position_id" in last_jd:
        return last_jd["position_id"] + 1
    return 1 

async def get_position_title(position_id: int) -> str:
    """
    Fetches the job title from the JD collection using position_id.
    Returns 'Unknown Position' if not found.
    """
    jd_doc = await job_description_collection.find_one({"position_id": position_id})
    if jd_doc:
        # JD model now uses "job_title"
        return jd_doc.get("jd", {}).get("job_title", jd_doc.get("jd", {}).get("title", "Unknown Position"))
    return "Unknown Position"


class ApplicantRepository:

    @staticmethod
    async def add_candidate(
    resume: ResumeExtractedData,
    match_result: MatchResult,
    resume_filename: str,
    resume_url: str,  # Moved before default parameter
    position_id: int = None
    ):
        """
        Add a candidate to MongoDB along with their evaluation result.
        And also Map the position_title from the position_id
        """

        #fetch match_result and position title to add that to mongo
        position_title = await get_position_title(position_id) if position_id else ""
        match_result = await compare_resume_with_jd(resume, position_title) if position_title else {}
        doc = {
            "resume": resume.model_dump(),
            "position": position_title,
            "position_id": position_id,
            "appliedDate": datetime.now(timezone.utc).date().isoformat(),
            "match_result": match_result.model_dump() if match_result else {},
            "resumeFileUrl": resume_url,  # Fixed variable name
            "testSent": False,
            "rejectionSent": False
        }
        result = await applicants_collection.insert_one(doc)
        return str(result.inserted_id)


    @staticmethod
    async def get_all_candidates():
        """
        Fetch all candidates.
        Returns candidate info along with evaluation result.
        """
        candidates = []
        async for doc in applicants_collection.find():
            doc["_id"] = str(doc["_id"])
            resume_data = doc.get("resume", {})

            # New resume model uses candidate_name and total_experience_years
            total_experience_years = resume_data.get("total_experience_years", 0) or resume_data.get("total_experience", 0)

            match_result = doc.get("match_result", {}) or {}
            # try to extract a sensible match_score and status from new/old shapes
            match_score = match_result.get("match_score") or (match_result.get("sectional_scores") or {}).get("overall_fit_score", 0)
            status = match_result.get("suitability") or match_result.get("overall_comments", "")

            candidate = {
                "id": doc["_id"],
                "name": resume_data.get("candidate_name", "") or resume_data.get("name", ""),
                "email": resume_data.get("email", ""),
                "position": doc.get("position", ""),
                "experience": total_experience_years,
                "appliedDate": doc.get("appliedDate", ""),
                "status": status,
                "resumeUrl": doc.get("resumeFileUrl", ""),
                "testSent": doc.get("testSent", False),
                "rejectionSent": doc.get("rejectionSent", False),
                "match_score": match_score,
                "reason": match_result.get("overall_comments", "")
            }
            candidates.append(candidate)

        return candidates

    @staticmethod
    async def mark_rejection_sent(candidate_id: str):
        """
        Update the candidate record to set rejectionSent = True.
        """
        from bson import ObjectId
        result = await applicants_collection.update_one(
            {"_id": ObjectId(candidate_id)},
            {"$set": {"rejectionSent": True}}
        )
        return result.modified_count > 0

    @staticmethod
    async def mark_test_sent(candidate_id: str):
        """
        Update the candidate record to set testSent = True.
        """
        from bson import ObjectId
        result = await applicants_collection.update_one(
            {"_id": ObjectId(candidate_id)},
            {"$set": {"testSent": True}}
        )
        return result.modified_count > 0

class JDRepository:

    @staticmethod
    async def add_jd(
        jd: JDExtractedData,
        jd_filename: str,
        jd_url: str
    ):
        """
        Add a parsed JD to MongoDB.
        Automatically assigns a new position_id (incremented from last JD).
        Stores JD data, filename, URL, and position_id.
        """
        # Get next position_id
        position_id = await get_position_id()

        # Prepare the document for insertion
        doc = {
            "jd": jd.model_dump(),
            "jd_filename": jd_filename,
            "jd_url": jd_url,
            "position_id": position_id,
        }

        # Insert into MongoDB
        result = await job_description_collection.insert_one(doc)
        
        # Return the newly created position_id so frontend/backend can map it
        return {
            "jd_id": str(result.inserted_id),
            "position_id": position_id
        }
    
    @staticmethod
    async def get_all_jds():
        jds=[]
        async for doc in job_description_collection.find():
            doc["_id"]=str(doc["_id"])
            jd={
                "id":doc["_id"],
                "title":doc["jd"]["title"],
                "position_id":doc["position_id"],
                "jd_url":doc["jd_url"],
                "status":"Active"

            }
            jds.append(jd)
        return jds



        
        
    
