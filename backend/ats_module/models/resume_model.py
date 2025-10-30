# from pydantic import BaseModel
# from typing import List, Optional

# class Experience(BaseModel):
#     company: str
#     role: str
#     duration: Optional[str] = None
#     description: Optional[str] = None

# class Education(BaseModel):
#     degree: str
#     institution: str
#     year: str

# class Resume(BaseModel):
#     name: str
#     email: str
#     phone: str
#     position: Optional[str] = None
#     skills: List[str]
#     education: List[Education]
#     experience: List[Experience]
#     total_experience: Optional[float] = None  # Add this for calculated total in years

from pydantic import BaseModel, Field
from typing import List, Optional


class SkillEvidence(BaseModel):
    skill_name: str
    used_in: Optional[str] = Field(None, description="Project or role where the skill was applied")
    duration: Optional[str] = Field(None, description="Duration of skill usage (e.g., '2 years')")
    depth_of_use: Optional[str] = Field(None, description="Proficiency level (Basic / Intermediate / Advanced)")
    quantified_outcome: Optional[str] = Field(None, description="Measured result or outcome, if mentioned")
    score: Optional[int] = Field(None, description="Skill evidence score (0-100)")


class WorkExperience(BaseModel):
    job_title: str
    company_name: str
    start_date: Optional[str]
    end_date: Optional[str]
    responsibilities: Optional[List[str]] = []
    projects_delivered: Optional[List[str]] = []
    technologies_used: Optional[List[str]] = []
    scale_indicators: Optional[List[str]] = []
    team_size: Optional[int] = None
    score: Optional[int] = Field(None, description="Experience relevance score (0-100)")


class Certification(BaseModel):
    name: str
    authority: Optional[str] = None
    year_obtained: Optional[int] = None
    validity_status: Optional[str] = Field(None, description="Active / Expired")
    related_skill_area: Optional[str] = None
    score: Optional[int] = None


class Education(BaseModel):
    degree_name: str
    field_of_study: Optional[str] = None
    institution: Optional[str] = None
    year_of_completion: Optional[int] = None
    relevance: Optional[str] = None
    score: Optional[int] = None


class DeliverableEvidence(BaseModel):
    description: str
    quantified_outcomes: Optional[str] = None
    problem_solving_examples: Optional[str] = None
    contribution_type: Optional[str] = Field(None, description="Independent / Team-based")
    score: Optional[int] = None


class ResumeExtractedData(BaseModel):
    candidate_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    total_experience_years: Optional[float] = Field(None, description="Total professional work experience in years")
    skills_inventory: List[SkillEvidence] = []
    work_experience: List[WorkExperience] = []
    certifications: List[Certification] = []
    education: List[Education] = []
    deliverable_evidence: List[DeliverableEvidence] = []
    overall_summary: Optional[str] = None
    extraction_confidence: Optional[float] = Field(None, description="Extraction confidence (0-1)")
