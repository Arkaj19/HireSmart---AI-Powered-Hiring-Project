# # ats_model.py
# from pydantic import BaseModel
# from typing import List

# class MatchResult(BaseModel):
#     match_score: int
#     matched_skills: List[str]
#     missing_skills: List[str]
#     suitability: str
#     reasoning: str

from pydantic import BaseModel, Field
from typing import List, Optional


class TaskMatch(BaseModel):
    jd_task: str
    evidence_from_resume: Optional[str] = Field(None, description="Evidence or project from resume showing capability")
    similarity_type: Optional[str] = Field(None, description="Exact / Similar / Related")
    confidence_score: Optional[int] = Field(None, description="Match confidence score (0-100)")
    comments: Optional[str] = None


class SectionalMatchScores(BaseModel):
    skills_match_score: Optional[int]
    experience_relevance_score: Optional[int]
    certification_alignment_score: Optional[int]
    education_alignment_score: Optional[int]
    deliverable_execution_score: Optional[int]
    overall_fit_score: Optional[int]
    

class GapRiskAnalysis(BaseModel):
    critical_gaps: List[str] = []
    moderate_gaps: List[str] = []
    trainable_gaps: List[str] = []
    overqualification_risks: List[str] = []




