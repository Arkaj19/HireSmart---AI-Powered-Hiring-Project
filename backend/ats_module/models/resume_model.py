from pydantic import BaseModel
from typing import List, Optional

class Experience(BaseModel):
    company: str
    role: str
    duration: Optional[str] = None
    description: Optional[str] = None

class Education(BaseModel):
    degree: str
    institution: str
    year: str

class Resume(BaseModel):
    name: str
    email: str
    phone: str
    position: Optional[str] = None
    skills: List[str]
    education: List[Education]
    experience: List[Experience]
    total_experience: Optional[float] = None  # Add this for calculated total in years