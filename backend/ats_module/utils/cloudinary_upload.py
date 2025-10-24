# # import cloudinary
# # import cloudinary.uploader
# # from dotenv import load_dotenv
# # import os

# # load_dotenv()

# # try:
# #     cloudinary.config(
# #         cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"), 
# #         api_key = os.getenv("CLOUDINARY_API_KEY"), 
# #         api_secret = os.getenv("CLOUDINARY_API_SECRET")
# #     )
# # except Exception as e:
# #     print(f"Cloudinary Configuration Failed: {e}")

# #     pass


# # #async def upload_file( file_bytes: bytes, resource_type: str = "auto", folder: str = "resumes"):
# # async def upload_file(
# #     file_bytes: bytes, 
# #     file_name: str, # <-- NEW: Accept the original filename
# #     folder: str = "resumes", # <-- Changed default folder name for clarity
# # ) -> dict:
# #     """
# #     Uploads a file's bytes to Cloudinary.

# #     Args:
# #         file_bytes: The content of the file as bytes.
# #         resource_type: Cloudinary resource type ('image', 'video', 'raw', 'auto').
# #         folder: The folder in Cloudinary to upload to.

# #     Returns:
# #         str: The secure URL of the uploaded file.
# #     """
# #     try:
# #          # Extract file extension from filename
# #         file_extension = file_name.rsplit('.', 1)[-1].lower() if '.' in file_name else 'pdf'
        
# #         # Create a proper filename without extension (Cloudinary adds it)
# #         base_name = file_name.rsplit('.', 1)[0] if '.' in file_name else file_name
        
# #         # For PDFs, use 'image' resource_type to enable preview
# #         # For other documents (DOC, DOCX), use 'raw'
# #         if file_extension == 'pdf':
# #             resource_type = 'image'
# #         else:
# #             resource_type = 'raw'

# #         upload_result = cloudinary.uploader.upload(
# #             file_bytes,
# #             resource_type=resource_type,
# #             folder=folder,
# #             format = file_extension,
# #             # public_id=base_name,
# #             pages=True if file_extension == 'pdf' else None,
# #         )

# #         # return upload_result.get("secure_url")
# #         return {
# #             "secure_url": upload_result.get("secure_url"),
# #             # "public_id": upload_result.get("public_id"),
# #             "format": upload_result.get("format"),
# #             "resource_type": upload_result.get("resource_type"),
# #             "bytes": upload_result.get("bytes"),
# #             "created_at": upload_result.get("created_at")
# #         }

# #     except Exception as e:
# #         print(f"Cloudinary upload failed: {e}")
# #         # In a real application, you'd log the full error
# #         raise Exception(f"Failed to upload file to Cloudinary: {str(e)}")

# import cloudinary
# import cloudinary.uploader
# from dotenv import load_dotenv
# import os

# load_dotenv()

# try:
#     cloudinary.config(
#         cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"), 
#         api_key = os.getenv("CLOUDINARY_API_KEY"), 
#         api_secret = os.getenv("CLOUDINARY_API_SECRET")
#     )
# except Exception as e:
#     print(f"Cloudinary Configuration Failed: {e}")
#     pass


# async def upload_file(
#     file_bytes: bytes, 
#     file_name: str,
#     folder: str = "resumes",
# ) -> dict:
#     """
#     Uploads a file's bytes to Cloudinary.

#     Args:
#         file_bytes: The content of the file as bytes.
#         file_name: Original filename with extension.
#         folder: The folder in Cloudinary to upload to.

#     Returns:
#         dict: Upload result with secure_url and metadata.
#     """
#     try:
#         # Extract file extension from filename
#         file_extension = file_name.rsplit('.', 1)[-1].lower() if '.' in file_name else 'pdf'
        
#         # Create a proper filename without extension
#         base_name = file_name.rsplit('.', 1)[0] if '.' in file_name else file_name
        
#         # ✅ Use 'raw' for PDFs and documents to make them downloadable/viewable
#         resource_type = 'raw'  # Changed from 'image'

#         upload_result = cloudinary.uploader.upload(
#             file_bytes,
#             resource_type=resource_type,
#             folder=folder,
#             public_id=base_name,  # ✅ Uncommented to use original filename
#             overwrite=True,
#             use_filename=True,
#             unique_filename=False  # Set to True if you want unique names
#         )

#         return {
#             "secure_url": upload_result.get("secure_url"),
#             "public_id": upload_result.get("public_id"),
#             "format": upload_result.get("format"),
#             "resource_type": upload_result.get("resource_type"),
#             "bytes": upload_result.get("bytes"),
#             "created_at": upload_result.get("created_at")
#         }

#     except Exception as e:
#         print(f"Cloudinary upload failed: {e}")
#         raise Exception(f"Failed to upload file to Cloudinary: {str(e)}")

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
        
        # Create a proper filename without extension
        base_name = file_name.rsplit('.', 1)[0] if '.' in file_name else file_name
        
        # ✅ Use 'image' for PDFs to enable preview/thumbnails
        resource_type = 'image'

        upload_result = cloudinary.uploader.upload(
            file_bytes,
            resource_type=resource_type,
            folder=folder,
            format=file_extension,  # ✅ Explicitly set format to 'pdf'
            # Don't set public_id to let Cloudinary generate unique names
            # Or use: public_id=f"{base_name}_{int(time.time())}"
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