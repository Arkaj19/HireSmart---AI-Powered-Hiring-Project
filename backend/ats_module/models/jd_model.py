from pydantic import BaseModel
from typing import List, Optional

class JobDescription(BaseModel):
    id: int
    title: str
    skills: List[str]
    keywords: Optional[List[str]] = []
    min_experience_months: Optional[int] = 0
