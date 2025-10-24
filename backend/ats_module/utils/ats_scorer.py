# import json
# from ats_module.models.resume_model import Resume
# from ats_module.models.jd_model import JobDescription
# from ats_module.models.ats_model import MatchResult
# from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain_core.prompts import ChatPromptTemplate
# import os
# from dotenv import load_dotenv

# load_dotenv()

# # ------------------ LLM Model ------------------
# model = ChatGoogleGenerativeAI(
#     model='gemini-2.5-flash',
#     google_api_key=os.getenv('GEMINI_API_KEY')
# )

# # ------------------ JD Loader ------------------
# def load_jd(position: str) -> JobDescription:
#     """
#     Loads the JD for a given position from data/jd.json.
#     """
#     jd_path = os.path.join(os.path.dirname(__file__), "..", "data", "jd.json")
#     with open(jd_path, "r") as f:
#         jd_data = json.load(f)

#     for jd_dict in jd_data:
#         if jd_dict["title"].lower() == position.lower():
#             return JobDescription(**jd_dict)  # Convert dict -> Pydantic model

#     raise ValueError(f"No JD found for position '{position}'")


# # ------------------ Compare Resume vs JD ------------------
# def compare_resume_with_jd(resume: Resume, position: str) -> MatchResult:
#     jd = load_jd(position)

#     prompt_template = ChatPromptTemplate.from_template("""
#     Compare the following resume details with the job description.

#     Job Description:
#     {jd}

#     Resume Details:
#     {resume}

#     Analyze the skill match, relevant experience, and suitability.
#     Return valid JSON with:
#     - match_score (0-100)
#     - matched_skills
#     - missing_skills
#     - suitability (Selected/Rejected)
#     - reasoning
#     """)

#     chain = prompt_template | model
#     response = chain.invoke({
#         "jd": jd.model_dump_json(),      # Correct usage with JobDescription
#         "resume": resume.model_dump_json()
#     })

#     # --- Parse LLM response safely ---
#     try:
#         if hasattr(response, "content"):
#             parsed = json.loads(response.content)
#         else:
#             parsed = json.loads(str(response))
#     except Exception as e:
#         print(f"[Warning] Parsing LLM response failed: {e}")
#         parsed = {
#             "match_score": 50,
#             "matched_skills": resume.skills[:3],
#             "missing_skills": [],
#             "suitability": "Fallback",
#             "reasoning": "Fallback scoring used."
#         }

#     # Blend with in-house scoring
#     final_score = evaluate_candidate(resume, jd, parsed["match_score"])
#     parsed["match_score"] = int(round(final_score))


#     # Map suitability to Selected/Rejected
#     parsed["suitability"] = "Selected" if final_score >= 40 else "Rejected"

#     return MatchResult(**parsed)


# # ------------------ In-house evaluation ------------------
# def evaluate_candidate(resume: Resume, jd: JobDescription, llm_score: float) -> float:
#     required_skills = jd.skills
#     skill_overlap = len(set(resume.skills) & set(required_skills))
#     total_skills = len(required_skills) or 1
#     skill_score = (skill_overlap / total_skills) * 100

#     # Weighted average: 70% LLM score, 30% rule-based
#     final_score = (0.7 * llm_score) + (0.3 * skill_score)
#     return round(final_score, 2)
import json
import re
from ats_module.models.resume_model import Resume
from ats_module.models.jd_model import JobDescription
from ats_module.models.ats_model import MatchResult
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
import os
from dotenv import load_dotenv

load_dotenv()

# ------------------ LLM Model ------------------
model = ChatGoogleGenerativeAI(
    model='gemini-2.5-flash',
    google_api_key=os.getenv('GEMINI_API_KEY')
)

# ------------------ JD Loader ------------------
def load_jd(position: str) -> JobDescription:
    """
    Loads the JD for a given position from data/jd.json.
    """
    jd_path = os.path.join(os.path.dirname(__file__), "..", "data", "jd.json")
    with open(jd_path, "r") as f:
        jd_data = json.load(f)

    for jd_dict in jd_data:
        if jd_dict["title"].lower() == position.lower():
            return JobDescription(**jd_dict)

    raise ValueError(f"No JD found for position '{position}'")


# ------------------ Helper Functions ------------------
def simple_normalize_skill(skill: str) -> str:
    """
    Basic normalization: lowercase and strip whitespace.
    No predefined mapping - keeps it flexible.
    """
    return skill.lower().strip()


def calculate_skill_overlap(resume_skills: list, jd_skills: list) -> tuple:
    """
    Simple set-based overlap calculation.
    Returns (matched_skills, overlap_count)
    """
    resume_normalized = {simple_normalize_skill(s) for s in resume_skills}
    jd_normalized = {simple_normalize_skill(s) for s in jd_skills}
    
    matched = resume_normalized & jd_normalized
    return list(matched), len(matched)


def extract_years_from_text(text: str) -> float:
    """
    Extract years from experience strings.
    Example: "5 years" → 5.0, "3+ years" → 3.0
    """
    if not text:
        return 0.0
    
    match = re.search(r'(\d+(?:\.\d+)?)\s*(?:\+)?\s*years?', str(text).lower())
    return float(match.group(1)) if match else 0.0


def calculate_experience_score(resume_exp: str, required_exp: str) -> float:
    """
    Compare candidate experience with required experience.
    Returns score out of 100.
    """
    candidate_years = extract_years_from_text(resume_exp)
    required_years = extract_years_from_text(required_exp)
    
    if required_years == 0:
        return 100  # No experience requirement specified
    
    if candidate_years >= required_years:
        return 100  # Meets or exceeds requirement
    elif candidate_years >= required_years * 0.7:
        return 70  # Has 70%+ of required experience
    else:
        return (candidate_years / required_years) * 50  # Proportional scoring


def safe_parse_llm_response(response) -> dict:
    """
    Robust parser that handles markdown code blocks and various LLM output formats.
    """
    content = response.content if hasattr(response, "content") else str(response)
    
    # Strip markdown code blocks
    if "```json" in content:
        content = content.split("```json")[1].split("```")[0]
    elif "```" in content:
        content = content.split("```")[1].split("```")[0]
    
    # Clean whitespace
    content = content.strip()
    
    return json.loads(content)


# ------------------ Compare Resume vs JD ------------------
def compare_resume_with_jd(resume: Resume, position: str) -> MatchResult:
    jd = load_jd(position)

    prompt_template = ChatPromptTemplate.from_template("""
You are an expert ATS (Applicant Tracking System). Compare the resume against the job description.

Job Description:
{jd}

Resume:
{resume}

Evaluation Criteria:
1. Skills Match: Recognize similar/equivalent skills using intelligent matching
   Few-shot examples of equivalent skills:
   - "JavaScript" = "JS" = "Javascript" = "java script"
   - "React" = "React.js" = "ReactJS" = "React JS"
   - "Node.js" = "NodeJS" = "Node" = "node js"
   - "Python" = "Python3" = "Py"
   - "Machine Learning" = "ML"
   - "Artificial Intelligence" = "AI"
   - "AWS" = "Amazon Web Services"
   - "Kubernetes" = "K8s"
   - "PostgreSQL" = "Postgres"
   - "MongoDB" = "Mongo"
   
   Apply this same logic to ALL skills - understand variations, abbreviations, and common aliases.

2. Experience Relevance: Evaluate years of experience and domain expertise
3. Education Fit: Assess degree level and field alignment
4. Project/Work Alignment: Check if past work aligns with job requirements

CRITICAL INSTRUCTIONS:
- Respond with ONLY valid JSON
- NO markdown formatting, NO code blocks, NO extra text
- Use the exact format specified below
- When matching skills, be intelligent about equivalents (as shown in examples)

Required JSON Format:
{{
  "match_score": <number between 0-100>,
  "matched_skills": ["skill1", "skill2", "skill3"],
  "missing_skills": ["skill4", "skill5"],
  "suitability": "Selected or Rejected",
  "reasoning": "Provide 2-3 sentences explaining key strengths and any critical gaps"
}}

Example Valid Response:
{{
  "match_score": 78,
  "matched_skills": ["Python", "Machine Learning", "Docker", "REST APIs"],
  "missing_skills": ["Kubernetes", "AWS"],
  "suitability": "Selected",
  "reasoning": "Candidate demonstrates 4 years of Python experience with strong ML project portfolio. Core technical skills align well with requirements. Missing cloud orchestration experience but can be trained."
}}

Now evaluate the candidate:
""")

    chain = prompt_template | model
    response = chain.invoke({
        "jd": jd.model_dump_json(),
        "resume": resume.model_dump_json()
    })

    # --- Parse LLM response with enhanced error handling ---
    try:
        parsed = safe_parse_llm_response(response)
    except Exception as e:
        print(f"[Warning] LLM response parsing failed: {e}")
        print(f"[Debug] Raw response: {response.content if hasattr(response, 'content') else response}")
        
        # Improved fallback with actual skill analysis
        matched_skills, overlap_count = calculate_skill_overlap(resume.skills, jd.skills)
        all_jd_skills_normalized = {simple_normalize_skill(s) for s in jd.skills}
        all_resume_skills_normalized = {simple_normalize_skill(s) for s in resume.skills}
        missing = list(all_jd_skills_normalized - all_resume_skills_normalized)
        
        parsed = {
            "match_score": 50,
            "matched_skills": matched_skills[:5] if matched_skills else resume.skills[:3],
            "missing_skills": missing[:5],
            "suitability": "Rejected",
            "reasoning": "System fallback: Unable to perform complete analysis. Manual review recommended."
        }

    # Blend with in-house scoring
    final_score = evaluate_candidate(resume, jd, parsed["match_score"])
    parsed["match_score"] = int(round(final_score))

    # Enhanced decision logic with tiered system
    parsed["suitability"] = determine_suitability(final_score, resume, jd)

    return MatchResult(**parsed)


# ------------------ Enhanced In-house Evaluation ------------------
def evaluate_candidate(resume: Resume, jd: JobDescription, llm_score: float) -> float:
    """
    Enhanced evaluation combining skills, experience, and LLM assessment.
    
    Scoring Weights:
    - Skills Match: 40%
    - Experience: 30%
    - LLM Contextual Analysis: 30%
    """
    # 1. SKILLS SCORING (40% weight)
    matched_skills, overlap_count = calculate_skill_overlap(resume.skills, jd.skills)
    total_skills = len(jd.skills) if jd.skills else 1
    skill_score = (overlap_count / total_skills) * 100

    # 2. EXPERIENCE SCORING (30% weight)
    resume_experience = getattr(resume, 'experience', '') or getattr(resume, 'total_experience', '')
    jd_experience = getattr(jd, 'experience_required', '') or getattr(jd, 'experience', '')
    exp_score = calculate_experience_score(resume_experience, jd_experience)

    # 3. LLM SCORE (30% weight)
    # LLM captures soft skills, communication quality, culture fit, and intelligent skill matching

    # Weighted formula
    final_score = (0.4 * skill_score) + (0.3 * exp_score) + (0.3 * llm_score)
    
    return round(final_score, 2)


def determine_suitability(final_score: float, resume: Resume, jd: JobDescription) -> str:
    """
    Multi-tier decision making for better accuracy.
    
    Thresholds:
    - 70+: Strong match (auto-select)
    - 50-69: Conditional (requires minimum 60% skill match)
    - <50: Rejection
    """
    if final_score >= 70:
        return "Selected"
    elif final_score >= 50:
        # Secondary check: Must have minimum core skills
        matched_skills, overlap_count = calculate_skill_overlap(resume.skills, jd.skills)
        total_skills = len(jd.skills) if jd.skills else 1
        skill_match_percentage = (overlap_count / total_skills) * 100
        
        if skill_match_percentage >= 60:
            return "Selected"
        else:
            return "Rejected"
    else:
        return "Rejected"