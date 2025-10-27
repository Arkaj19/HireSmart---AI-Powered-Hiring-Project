import fitz
import os
from pathlib import Path
from dotenv import load_dotenv
from ats_module.models.resume_model import Resume
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()

model = ChatGoogleGenerativeAI(
    model='gemini-2.5-flash',
    google_api_key=os.getenv('GEMINI_API_KEY')
)

# ---------------Extract text from PDF ------------------
def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Reads a PDF file (in bytes) and extracts its text content.
    """
    text = ""
    with fitz.open(stream=pdf_bytes, filetype="pdf") as pdf:
        for page in pdf:
            text += page.get_text("text")
    return text.strip()

# ------------- Parse resume content into structured format -----------------
def parse_resume(pdf_bytes: bytes) -> Resume:
    text = extract_text_from_pdf(pdf_bytes)

    prompt_template = ChatPromptTemplate.from_template("""
        Analyze the following resume text and extract structured information with accurate experience calculation.

        CRITICAL INSTRUCTIONS FOR EXPERIENCE CALCULATION:
        1. Extract ALL work experience entries with start and end dates
        2. For each position, calculate the duration in years (including partial years)
        3. Sum up ALL durations to get total professional experience
        4. Convert months to years (e.g., 18 months = 1.5 years)
        5. If dates are in month/year format (e.g., "Dec 2023 - Oct 2024"), calculate precise duration
        6. If only years are given (e.g., "2023-2024"), assume full year duration
        7. For current positions marked as "Present" or ongoing, calculate up to current date
        8. Round total experience to 2 decimal places

        Please extract:
        1. Personal Information: name, email, phone number
        2. Skills: as a list of strings
        3. Education: as a list of educational qualifications
        4. Work Experience: as a list containing objects with company name, job role, duration (in years), start_date, end_date, and description
        5. Total Experience: calculated sum of all work experience durations in years

        Resume Text:
        {resume_text}

        Return the data in a structured JSON format with precise experience calculation.
        """)


    chain = prompt_template | model.with_structured_output(Resume)
    result = chain.invoke({"resume_text": text})
    return result



  
