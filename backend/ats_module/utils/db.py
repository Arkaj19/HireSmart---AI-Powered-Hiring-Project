from motor.motor_asyncio import AsyncIOMotorClient

MONGO_DETAILS = "mongodb+srv://larvaidol_db_user:NHic6HJqGJ9EGrbQ@hiresmartcluster.f4ujoiv.mongodb.net/candidates?retryWrites=true&w=majority&appName=HireSmartCluster"

client = AsyncIOMotorClient(MONGO_DETAILS)
database = client["Candidates"]
applicants_collection = database["Applicants"]

async def connect_to_mongo():
    print("✅ Connected to MongoDB")

async def disconnect_from_mongo():
    client.close()
    print("❌ Disconnected from MongoDB")
