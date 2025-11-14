from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, Cookie
from ats_module.utils.db import database

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "YOUR_SECRET_KEY"  # Move to env later
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 1 day

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, ALGORITHM)

def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, ALGORITHM)
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(token: str = Cookie(None)):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = decode_token(token)
    return payload
