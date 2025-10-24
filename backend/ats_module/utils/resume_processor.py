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
Analyze the following resume text and extract structured information.

Please extract:
1. Personal Information: name, email, phone number
2. Skills: as a list of strings
3. Education: as a list of educational qualifications
4. Work Experience: as a list containing objects with company name, job role, duration, and description

Resume Text:
{resume_text}

Return the data in a structured JSON format.
""")

    chain = prompt_template | model.with_structured_output(Resume)
    result = chain.invoke({"resume_text": text})
    return result



  
