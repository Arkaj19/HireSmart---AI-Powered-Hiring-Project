import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()  # load environment variables

async def send_rejection_email(to_email: str, candidate_name: str, position: str):
    # Email content
    subject = f"Application Update - {position} at GyanSys"
    body = f"""
    Dear {candidate_name},

    Thank you for your interest in the {position} position at GyanSys.

    After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.

    We appreciate the time and effort you invested and encourage you to apply for future opportunities with us.

    Best regards,
    GyanSys Talent Acquisition Team
    """

    message = MIMEMultipart()
    message["From"] = os.getenv("EMAIL_ADDRESS")
    message["To"] = to_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    try:
        await aiosmtplib.send(
            message,
            hostname="smtp.gmail.com",
            port=587,
            start_tls=True,
            username=os.getenv("EMAIL_ADDRESS"),
            password=os.getenv("EMAIL_PASSWORD"),
        )
        return True
    except Exception as e:
        print("❌ Error sending email:", e)
        return False
