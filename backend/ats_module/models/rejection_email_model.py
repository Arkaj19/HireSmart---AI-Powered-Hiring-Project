from pydantic import BaseModel

class RejectionRequest(BaseModel):
    email: str
    name: str
    position: str