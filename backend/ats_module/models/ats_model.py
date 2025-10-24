# ats_model.py
from pydantic import BaseModel
from typing import List

class MatchResult(BaseModel):
    match_score: int
    matched_skills: List[str]
    missing_skills: List[str]
    suitability: str
    reasoning: str
