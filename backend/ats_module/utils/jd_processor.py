import fitz
from docx import Document
from ats_module.models.jd_model import JDExtractedData
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

async def parse_jd(file_bytes:bytes,filenmae:str)->JDExtractedData:
    try:
        if filenmae.lower().endswith(".pdf"):
            jd_text=extract_text_from_pdf(file_bytes)
        elif filenmae.lower().endswith(".docx"):
            jd_text=extract_text_from_docx(file_bytes)
        

        prompt_template = ChatPromptTemplate.from_template("""
        You are an expert Technical Resource Evaluator for IT service delivery projects.
        Your goal is to analyze the Job Description (JD) document and extract its structured information accurately.

        **CONTEXT:**
        - The client expects measurable project outcomes (business targets, ROI).
        - Your role is to identify what technical and functional capabilities are required for successful project delivery.
        - Focus on **what needs to be done (deliverables)** and **what skills are required to do it**, not just keyword extraction.

        -----------------------------------------------------------------------------------------------------------

        ## Part 1: Job Requirement Decomposition
        From the Job Description, extract and structure:

        ### A. Technical Skills Required (0–100 score)
        - Core technical skills, tools, and frameworks explicitly or implicitly required.
        - Proficiency level expected (e.g., Beginner, Intermediate, Expert).
        - Domain or business area knowledge (e.g., Healthcare, BFSI, Retail).
        - Map each skill to **specific tasks or deliverables it enables.**

        Return each skill as:
        {{
        "skill_name": "React.js",
        "proficiency_required": "Advanced",
        "related_tasks": ["Build dynamic UI components", "Integrate APIs for dashboard"],
        "domain": "Web Development",
        "importance_weight": 1.0,
        "score": 90
        }}

        ---

        ### B. Responsibilities & Deliverables (0–100 score)
        - Key responsibilities and ownership areas.
        - Expected deliverables or outputs (tangible work products).
        - Success criteria or performance indicators (uptime %, quality, metrics).

        Return each as:
        {{
        "responsibility": "Design and develop RESTful APIs",
        "deliverables": ["Scalable microservices", "Automated deployment scripts"],
        "success_criteria": "99.9 percent uptime and 200ms response time",
        "score": 85
        }}

        ---

        ### C. Experience Requirements (0–100 score)
        - Total and relevant years of experience required.
        - Typical project types or scales expected.
        - Complexity indicators: team size, user load, data volume.
        - Industry/domain experience preferred.

        Return as:
        {{
        "total_experience_required": 5,
        "relevant_experience_required": 3,
        "project_types": ["Enterprise Web Applications", "Cloud Migration"],
        "scale_indicators": ["Handled 10K+ users", "Led 5-member teams"],
        "domain_experience": "E-commerce",
        "measurable_indicators": ["Delivered 3 major releases in a year"],
        "score": 88
        }}

        ---

        ### D. Task Execution Capability (0–100 score)
        - Specific tasks the role must perform (explicit or implied).
        - Level of independence or decision-making required.
        - Common challenges or problem-solving expectations.

        Return each as:
        {{
        "task_name": "Integrate third-party payment APIs",
        "problem_solving_scenario": "Resolve authentication failures and latency issues",
        "autonomy_level": "High",
        "score": 92
        }}

        ---

        Also extract the following metadata:
        - job_title
        - department
        - company_name
        - location
        - overall_summary: concise 2–3 line summary of the JD
        - extraction_confidence (0–1 float, your confidence in extraction accuracy)
                                                           
        Here is the Job Description Text: {jd_text}

        -----------------------------------------------------------------------------------------------------------

        **Return the result strictly as a JSON adhering to the JDExtractedData Pydantic model below.**
        """)

        chain = prompt_template | model.with_structured_output(JDExtractedData)
        response=await chain.ainvoke({"jd_text":jd_text})
        return response
    
    except Exception as e:
        print(f"JD parsing failed: {e}")
        raise Exception(f"JD parsing failed: {str(e)}")