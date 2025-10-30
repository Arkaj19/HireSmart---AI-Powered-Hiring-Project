from pydantic import BaseModel, Field
from typing import List, Optional
from ats_module.models.ats_model import TaskMatch, SectionalMatchScores, GapRiskAnalysis

class MatchResult(BaseModel):
    job_id: Optional[str] = None
    candidate_id: Optional[str] = None
    candidate_name: Optional[str] = None
    task_specific_matches: List[TaskMatch] = []
    sectional_scores: Optional[SectionalMatchScores] = None
    gap_risk_analysis: Optional[GapRiskAnalysis] = None
    overall_comments: Optional[str] = None
    generated_on: Optional[str] = Field(None, description="Timestamp of match generation")