from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_DETAILS = os.getenv('MONGO_URI')

if not MONGO_DETAILS:
    raise RuntimeError("❌ MONGO_URI is not set in .env file")

client = AsyncIOMotorClient(MONGO_DETAILS)
database = client["Candidates"]

applicants_collection = database["Applicants"]
job_description_collection=database["JobDescriptions"]

async def connect_to_mongo():
    print("✅ Connected to MongoDB")

async def disconnect_from_mongo():
    client.close()
    print("❌ Disconnected from MongoDB")
