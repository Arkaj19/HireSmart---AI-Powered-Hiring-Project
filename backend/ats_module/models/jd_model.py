from pydantic import BaseModel
from typing import List, Optional

class JobDescription(BaseModel):
    id: Optional[int] = None
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    skills: List[str]
    keywords: Optional[List[str]] = []
    min_experience_months: Optional[int] = 0
    education: Optional[List[str]] = []
    responsibilities: Optional[List[str]] = []
    
