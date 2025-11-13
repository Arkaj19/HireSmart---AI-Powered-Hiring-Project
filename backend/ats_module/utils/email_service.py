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

    Thank you for taking the time to apply for the position of {position} at GyanSys. 
    We truly appreciate your interest in joining our team and the effort you put into the application process.

    After a thorough review of your profile, we regret to inform you that we will not be moving forward 
    with your application at this stage. This decision was made after careful consideration of the role 
    requirements and the qualifications of all applicants.

    Please know that this outcome does not diminish the value of your experience or potential. We encourage 
    you to stay connected with us and apply for future opportunities that align with your skills and career goals.

    Thank you once again for your interest in GyanSys. We wish you success in all your future endeavors.

    Warm regards,
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


async def send_shortlist_email(to_email: str, candidate_name: str, position: str, test_link: str = None):
    """
    Send a shortlisting email with optional test link.
    """
    subject = f"Congratulations! Next Steps for {position} at GyanSys"
    
    # Base body
    body = f"""
    Dear {candidate_name},

    Congratulations! We are pleased to inform you that you have been shortlisted for the position of {position} at GyanSys.
    Your background and experience stood out during our initial evaluation, and we are excited to move forward with the next steps in our hiring process.
    """
    # Add test link if provided
    if test_link:
        body += f"""
    As part of the next stage, please complete the technical assessment using the link below:

    {test_link}

    The assessment typically takes around 60–90 minutes to complete. We kindly request that you submit it within the next 48 hours.
    """
    else:
        body += """
    Our Talent Acquisition team will reach out to you shortly with the next steps in the interview process.
    """

    body += """
    If you have any questions or need any assistance, please feel free to reach out to us.

    Warm regards,
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
        print("❌ Error sending shortlist email:", e)
        return False