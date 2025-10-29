from datetime import datetime, timezone
from dateutil.relativedelta import relativedelta
from dateutil.parser import parse as parse_date
from ats_module.models.resume_model import Resume
from ats_module.models.jd_model import  JobDescription
from ats_module.models.ats_model import MatchResult
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
        # JD is stored inside the "jd" key → jd_doc["jd"]["title"]
        return jd_doc.get("jd", {}).get("title", "Unknown Position")
    return "Unknown Position"


class ApplicantRepository:

    @staticmethod
    async def add_candidate(
    resume: Resume,
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
        match_result = compare_resume_with_jd(resume, position_title) if position_title else {}
        doc = {
            "resume": resume.model_dump(),
            "position": position_title,
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
        Fetch all candidates and calculate total experience in years.
        Returns candidate info along with evaluation result.
        """
        candidates = []
        async for doc in applicants_collection.find():
            doc["_id"] = str(doc["_id"])

            # Calculate relevant experience in months
            # experience_list = doc.get("resume", {}).get("experience", [])
            # total_months = 0
            # for exp in experience_list:
            #     duration = exp.get("duration", "")
            #     months = ApplicantRepository.parse_duration_to_months(duration)
            #     total_months += months
            resume_data = doc.get("resume", {})
            total_experience_years = resume_data.get("total_experience", 0)

            candidate = {
                "id": doc["_id"],
                "name": doc.get("resume", {}).get("name", ""),
                "email": doc.get("resume", {}).get("email", ""),
                "position": doc.get("position", ""),
                # "experience": round(total_months / 12, 2),  # in years
                "experience": total_experience_years,
                "appliedDate": doc.get("appliedDate", ""),
                "status": doc.get("match_result", {}).get("suitability", ""),
                "resumeUrl": doc.get("resumeFileUrl", ""),
                "testSent": doc.get("testSent", False),
                "rejectionSent": doc.get("rejectionSent", False),
                "match_score": doc.get("match_result", {}).get("match_score", 0),
                "reason": doc.get("match_result", {}).get("reasoning", "")
            }
            candidates.append(candidate)

        return candidates

    @staticmethod
    def parse_duration_to_months(duration: str) -> int:
        """
        Convert a duration string like "Jun'21 - Jun'23" or "2021-2023" to total months.
        Returns 0 if parsing fails.
        """
        try:
            # Normalize apostrophes and spaces
            duration = duration.replace("’", "'").strip()
            # Extract start and end using regex
            match = re.findall(r"([A-Za-z]{3}'?\d{2,4}|Present|\d{4})", duration)
            if not match:
                return 0

            start_str = match[0]
            end_str = match[1] if len(match) > 1 else "Present"

            start_date = ApplicantRepository.parse_date_str(start_str)
            end_date = datetime.now(timezone.utc) if end_str.lower() in ["present"] else ApplicantRepository.parse_date_str(end_str)
            delta = relativedelta(end_date, start_date)
            return delta.years * 12 + delta.months
        except Exception:
            return 0

    @staticmethod
    def parse_date_str(date_str: str) -> datetime:
        """
        Convert date strings like "Jun'21", "2021", "25" to datetime objects.
        """
        # Fix 2-digit years
        if re.match(r"'\d{2}$", date_str):
            date_str = "20" + date_str[-2:]
        elif re.match(r"^\d{2}$", date_str):
            date_str = "20" + date_str

        # Try parsing
        try:
            return parse_date(date_str)
        except Exception:
            return datetime.utcnow()  # fallback to now

class JDRepository:

    @staticmethod
    async def add_jd(
        jd: JobDescription,
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

