from datetime import datetime, timezone
from dateutil.relativedelta import relativedelta
from dateutil.parser import parse as parse_date
from ats_module.models.resume_model import Resume
from ats_module.models.ats_model import MatchResult
from ats_module.utils.db import applicants_collection
from ats_module.utils.ats_scorer import compare_resume_with_jd

import re
import json
from pathlib import Path

#--------------------Get position title from position id --------------------------------------
JD_FILE = Path(__file__).parent.parent / "data" / "jd.json"

with open(JD_FILE, "r", encoding="utf-8") as f:
    jd_list = json.load(f)

POSITION_MAP = {str(jd["id"]): jd["title"] for jd in jd_list}

def get_position_title(position_id: int) -> str:
    return POSITION_MAP.get(str(position_id), "Unknown Position")



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
        position_title = get_position_title(position_id) if position_id else ""
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
            experience_list = doc.get("resume", {}).get("experience", [])
            total_months = 0
            for exp in experience_list:
                duration = exp.get("duration", "")
                months = ApplicantRepository.parse_duration_to_months(duration)
                total_months += months

            candidate = {
                "id": doc["_id"],
                "name": doc.get("resume", {}).get("name", ""),
                "email": doc.get("resume", {}).get("email", ""),
                "position": doc.get("position", ""),
                "experience": round(total_months / 12, 2),  # in years
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
