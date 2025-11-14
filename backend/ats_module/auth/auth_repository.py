from ats_module.utils.db import database
from bson import ObjectId

users_collection = database["users"]

async def find_user_by_email(email: str):
    return await users_collection.find_one({"email": email})

async def find_user_by_employeeId(employeeId: str):
    return await users_collection.find_one({"employeeId": employeeId})

async def create_user(doc: dict):
    res = await users_collection.insert_one(doc)
    return str(res.inserted_id)

async def find_user_by_id(uid: str):
    return await users_collection.find_one({"_id": ObjectId(uid)})
