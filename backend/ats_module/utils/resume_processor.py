import fitz
import os
from pathlib import Path
from dotenv import load_dotenv
from ats_module.models.resume_model import ResumeExtractedData
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
def parse_resume(pdf_bytes: bytes) -> ResumeExtractedData:
    text = extract_text_from_pdf(pdf_bytes)
 
    # prompt_template = ChatPromptTemplate.from_template("""
    #     Analyze the following resume text and extract structured information with accurate experience calculation.
 
    #     You are an AI Resume Parser.
    #     Extract all work experience entries and calculate accurate professional experience based on these rules:
 
    #     CRITICAL INSTRUCTIONS FOR EXPERIENCE CALCULATION:
    #     1. Extract all work experience entries with start and end dates.
    #     2. For each entry, calculate the duration in months and convert to years (include partial years).
    #     3. Sum all durations to get total professional experience.
    #     4. Convert months to years: 18 months = 1.5 years.
    #     5. If dates are in month/year format (e.g., "Dec 2023 - Oct 2024"), calculate precise duration.
    #     6. If only years are given (e.g., "2023 - 2024"), assume a full year = 12 months.
    #     7. For current or ongoing roles marked as "Present" or "Ongoing", calculate up to the current system date.
    #     8. Round each role’s duration and the total experience to 2 decimal places.
    #     9. Handle two-digit years intelligently:
    #     - If the year is between ‘00–‘30, interpret it as 2000–2030 (e.g., "May 23" → "May 2023").
    #     - If the year is between ‘70–‘99, interpret it as 1970–1999 (e.g., "Jan 98" → "Jan 1998").
    #     - Choose the most chronologically logical interpretation based on the resume timeline.
 
    #     EXAMPLES:
    #     - "Jan 2023 - Oct 2024" → 21 months → 1.75 years
    #     - "Dec 2023 - Present (Oct 2025)" → 22 months → 1.83 years
    #     - "2022 - 2023" → 12 months → 1.00 year
    #     - "01/2023 - Present" → 33 months (as of Oct 2025) → 2.75 years
    #     - "May 24 - Present" → interpret as "May 2024 - Present"
    #     - "Jan 98 - Dec 99" → interpret as "Jan 1998 - Dec 1999"
 
    #     Return each role with its calculated duration and include the summed total experience in years.
 
    #     Please extract:
    #     1. Personal Information: name, email, phone number
    #     2. Skills: as a list of strings
    #     3. Education: as a list of educational qualifications
    #     4. Work Experience: as a list containing objects with company name, job role, duration (in years), start_date, end_date, and description
    #     5. Total Experience: calculated sum of all work experience durations in years
 
    #     Resume Text:
    #     {resume_text}
 
    #     Return the data in a structured JSON format with precise experience calculation.
    #     """)
    prompt_template = ChatPromptTemplate.from_template("""
    You are an expert Technical Resource Evaluator for IT service delivery projects.
    Your goal is to extract structured, evidence-based data from a candidate's Resume document.

    **CONTEXT:**
    - The resume will be used later to match against a Job Description.
    - Focus only on factual data present in the resume: skills, experiences, projects, education, and achievements.

    **OUTPUT STRUCTURE (Resume Data Extraction):**

    ## Part 1: Skills Inventory with Evidence
    For each skill:
    - Skill name
    - Where it was used (project/role)
    - Duration (months or years)
    - Depth of use (basic / intermediate / advanced)
    - Quantified outcome (if mentioned)
    - Score (0–100) per the rubric below:
    - Mentioned without context → 20–40
    - Used in 1 project with duration → 40–60
    - Used across multiple projects with outcomes → 60–80
    - Expertise with certification + measurable impact → 80–100

    ## Part 2: Work Experience
    For each role:
    - Job title, company, duration (from–to)
    - Responsibilities
    - Projects delivered
    - Technologies used
    - Team size, scale indicators
    - Score (0–100 based on quality, relevance, and impact)

    ## Part 3: Certifications & Qualifications
    - Name of certification
    - Issuing authority
    - Year obtained
    - Validity status (active/expired)
    - Related skill area
    - Score (0–100)

    ## Part 4: Education
    - Degree name
    - Field of study
    - Institution
    - Year of completion
    - Relevance to IT/service projects
    - Score (0–100)

    ## Part 5: Deliverable Evidence
    - Description of deliverables completed
    - Quantified outcomes (e.g., "Reduced latency by 40%")
    - Problem-solving examples
    - Independent vs. team contribution
    - Score (0–100)

    Also extract:
    - total_experience_years (sum of professional work experience)
    - overall_summary (brief summary of the candidate’s professional profile)
    - extraction_confidence (0–1 float)
                                                       
    Resume Text:
    {resume_text}

    Return all data in structured JSON strictly following the pydantic model fields.
    """)

 
 
    chain = prompt_template | model.with_structured_output(ResumeExtractedData)
    result = chain.invoke({"resume_text": text})
    return result
 
 
 
 
 
 