import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
import os

load_dotenv()

try:
    cloudinary.config(
        cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"), 
        api_key = os.getenv("CLOUDINARY_API_KEY"), 
        api_secret = os.getenv("CLOUDINARY_API_SECRET")
    )
except Exception as e:
    print(f"Cloudinary Configuration Failed: {e}")
    pass


async def upload_file(
    file_bytes: bytes, 
    file_name: str,
    folder: str = "resumes",
) -> dict:
    """
    Uploads a file's bytes to Cloudinary.

    Args:
        file_bytes: The content of the file as bytes.
        file_name: Original filename with extension.
        folder: The folder in Cloudinary to upload to.

    Returns:
        dict: Upload result with secure_url and metadata.
    """
    try:
        # Extract file extension from filename
        file_extension = file_name.rsplit('.', 1)[-1].lower() if '.' in file_name else 'pdf'
        
        # ✅ Use 'image' for PDFs to enable preview/thumbnails
        if file_extension in ["pdf", "jpg", "jpeg", "png"]:
            resource_type = "image"  # Enables preview
        else:
            resource_type = "raw"    # For docx, txt, csv, etc.

        upload_result = cloudinary.uploader.upload(
            file_bytes,
            resource_type=resource_type,
            folder=folder,
            format=file_extension,  # ✅ Explicitly set format to 'pdf'
           
        )

        return {
            "secure_url": upload_result.get("secure_url"),
            "public_id": upload_result.get("public_id"),
            "format": upload_result.get("format", file_extension),  # Fallback to file_extension
            "resource_type": upload_result.get("resource_type"),
            "bytes": upload_result.get("bytes"),
            "created_at": upload_result.get("created_at")
        }

    except Exception as e:
        print(f"Cloudinary upload failed: {e}")
        raise Exception(f"Failed to upload file to Cloudinary: {str(e)}")