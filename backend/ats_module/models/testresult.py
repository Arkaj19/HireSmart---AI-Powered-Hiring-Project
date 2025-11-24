from pydantic import BaseModel

class TestResultModel(BaseModel):
    email: str
    score: int
    status: str