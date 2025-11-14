from pydantic import BaseModel, EmailStr
from typing import Optional

class RegisterModel(BaseModel):
    email: EmailStr
    employeeId: str
    password: str
    phone: str
    name: str
    designation: str

class LoginModel(BaseModel):
    email: EmailStr
    employeeId: str
    password: str

class UserOut(BaseModel):
    _id: str
    email: EmailStr
    employeeId: str
    phone: str
    name: str
    designation: str
    profile: dict
