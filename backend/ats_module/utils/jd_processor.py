import fitz
from docx import Document
from ats_module.models.jd_model import JobDescription
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
import os
from dotenv import load_dotenv
import io

load_dotenv()

model = ChatGoogleGenerativeAI(
    model='gemini-2.5-flash',
    google_api_key=os.getenv('GEMINI_API_KEY')
)

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Reads a PDF file (in bytes) and extracts its text content.
    """
    text = ""
    with fitz.open(stream=pdf_bytes, filetype="pdf") as pdf:
        for page in pdf:
            text += page.get_text("text")
    return text.strip()

def extract_text_from_docx(docx_bytes: bytes) -> str:
    text = ""
    doc = Document(io.BytesIO(docx_bytes))
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text.strip()

async def parse_jd(file_bytes:bytes,filenmae:str)->JobDescription:
    try:
        if filenmae.lower().endswith(".pdf"):
            jd_text=extract_text_from_pdf(file_bytes)
        elif filenmae.lower().endswith(".docx"):
            jd_text=extract_text_from_docx(file_bytes)
            
        prompt_template = ChatPromptTemplate.from_template("""You are an expert HR assistant. Extract structured information from the given Job Description (JD)
            and return it as a valid JSON object strictly matching the following fields:

            {{
            "title": str,
            "company": str or null,
            "location": str or null,
            "skills": [list of skills],
            "keywords": [list of key phrases],
            "min_experience_months": integer,
            "education": [list of qualifications],
            "responsibilities": [list of responsibilities]
            }}

            Guidelines:
            - If any field is missing in the JD, return null or an empty list as appropriate.
            - Estimate "min_experience_months" based on text like “2+ years” (e.g., 2 years = 24 months).
            - Extract skills and keywords as unique, relevant terms (e.g., "React", "Node.js", "Leadership").
            - Keep the JSON clean and valid (no comments, no extra text).

            Here is the Job Description Text: {jd_text}
            """)
        chain = prompt_template | model.with_structured_output(JobDescription)
        response=await chain.ainvoke({"jd_text":jd_text})
        return response
    
    except Exception as e:
        print(f"JD parsing failed: {e}")
        raise Exception(f"JD parsing failed: {str(e)}")