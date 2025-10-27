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

        You are an AI Resume Parser. 
        Extract all work experience entries and calculate accurate professional experience based on these rules:

        CRITICAL INSTRUCTIONS FOR EXPERIENCE CALCULATION:
        1. Extract all work experience entries with start and end dates.
        2. For each entry, calculate the duration in months and convert to years (include partial years).
        3. Sum all durations to get total professional experience.
        4. Convert months to years: 18 months = 1.5 years.
        5. If dates are in month/year format (e.g., "Dec 2023 - Oct 2024"), calculate precise duration.
        6. If only years are given (e.g., "2023 - 2024"), assume a full year = 12 months.
        7. For current or ongoing roles marked as "Present" or "Ongoing", calculate up to the current system date.
        8. Round each role’s duration and the total experience to 2 decimal places.
        9. Handle two-digit years intelligently:
        - If the year is between ‘00–‘30, interpret it as 2000–2030 (e.g., "May 23" → "May 2023").
        - If the year is between ‘70–‘99, interpret it as 1970–1999 (e.g., "Jan 98" → "Jan 1998").
        - Choose the most chronologically logical interpretation based on the resume timeline.

        EXAMPLES:
        - "Jan 2023 - Oct 2024" → 21 months → 1.75 years
        - "Dec 2023 - Present (Oct 2025)" → 22 months → 1.83 years
        - "2022 - 2023" → 12 months → 1.00 year
        - "01/2023 - Present" → 33 months (as of Oct 2025) → 2.75 years
        - "May 24 - Present" → interpret as "May 2024 - Present"
        - "Jan 98 - Dec 99" → interpret as "Jan 1998 - Dec 1999"

        Return each role with its calculated duration and include the summed total experience in years.

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



  
