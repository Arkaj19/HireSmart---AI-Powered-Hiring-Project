from pydantic import BaseModel

class ShortlistRequest(BaseModel):
    candidate_id: str
    email: str
    name: str
    position: str