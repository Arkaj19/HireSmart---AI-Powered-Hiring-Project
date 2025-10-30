# from pydantic import BaseModel
# from typing import List, Optional

# class JobDescription(BaseModel):
#     id: Optional[int] = None
#     title: str
#     company: Optional[str] = None
#     location: Optional[str] = None
#     skills: List[str]
#     keywords: Optional[List[str]] = []
#     min_experience_months: Optional[int] = 0
#     education: Optional[List[str]] = []
#     responsibilities: Optional[List[str]] = []
    
from pydantic import BaseModel, Field
from typing import List, Optional


class TechnicalSkill(BaseModel):
    skill_name: str = Field(..., description="Name of the technical skill, tool, or technology")
    proficiency_required: Optional[str] = Field(None, description="Proficiency level required (e.g., Beginner, Intermediate, Expert)")
    related_tasks: Optional[List[str]] = Field(default_factory=list, description="Tasks enabled by this skill")
    score: Optional[int] = Field(None, description="Relevance score out of 100 for this skill")


class Responsibility(BaseModel):
    responsibility: str = Field(..., description="Key responsibility as mentioned in JD")
    deliverables: Optional[List[str]] = Field(default_factory=list, description="Concrete work products expected from this responsibility")
    success_criteria: Optional[str] = Field(None, description="Quality or performance standards mentioned")
    score: Optional[int] = Field(None, description="Relevance score out of 100 for this responsibility")


class ExperienceRequirement(BaseModel):
    total_experience_years: Optional[float] = Field(None, description="Total years of experience required")
    relevant_experience_years: Optional[float] = Field(None, description="Relevant experience in the specified domain or technology")
    project_types: Optional[List[str]] = Field(default_factory=list, description="Types of projects mentioned (e.g., enterprise apps, ML models)")
    scale_indicators: Optional[List[str]] = Field(default_factory=list, description="Complexity indicators such as team size, user volume, etc.")
    domain_experience: Optional[str] = Field(None, description="Industry or business domain experience required")
    measurable_indicators: Optional[List[str]] = Field(default_factory=list, description="Quantifiable experience metrics (e.g., 'Led 5+ teams')")
    score: Optional[int] = Field(None, description="Score out of 100 for this section")


class TaskCapability(BaseModel):
    task_name: str = Field(..., description="Specific task or activity from the JD")
    problem_solving_scenario: Optional[str] = Field(None, description="Mentioned or implied scenario showcasing problem-solving")
    autonomy_level: Optional[str] = Field(None, description="Expected level of independence (e.g., self-directed, supervised)")
    score: Optional[int] = Field(None, description="Capability score out of 100 for this task")


class JDExtractedData(BaseModel):
    job_title: Optional[str] = Field(None, description="Extracted job title if available")
    department: Optional[str] = Field(None, description="Department or functional area (if available)")
    location: Optional[str] = Field(None, description="Job location (if mentioned)")
    company_name: Optional[str] = Field(None, description="Name of the company or client")
    technical_skills: List[TechnicalSkill] = Field(default_factory=list, description="List of technical skills extracted")
    responsibilities: List[Responsibility] = Field(default_factory=list, description="List of key responsibilities and deliverables")
    experience_requirements: ExperienceRequirement = Field(default_factory=ExperienceRequirement, description="Experience-related details")
    task_capabilities: List[TaskCapability] = Field(default_factory=list, description="Task-level execution details")
    overall_summary: Optional[str] = Field(None, description="LLM-generated concise summary of the JD")
    extraction_confidence: Optional[float] = Field(None, description="Overall extraction confidence score (0-1)")
