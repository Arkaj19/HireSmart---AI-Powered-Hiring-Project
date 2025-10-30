import json
import re
from ats_module.models.resume_model import ResumeExtractedData
from ats_module.models.jd_model import JDExtractedData
from ats_module.models.match_result_model import MatchResult
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from ats_module.utils.db import job_description_collection
import os
from dotenv import load_dotenv
 
load_dotenv()
 
# ------------------ LLM Model ------------------
model = ChatGoogleGenerativeAI(
    model='gemini-2.5-flash',
    google_api_key=os.getenv('GEMINI_API_KEY')
)
 
# ------------------ JD Loader ------------------
async def load_jd(position: str) -> JDExtractedData:
    """
    Loads the JD for a given position from MongoDB JobDescriptions collection.
    Expects documents with a 'jd' field that contains the JobDescription dict.
    Matches JD job_title case-insensitively.
    Raises ValueError if not found.
    """
    if not position:
        raise ValueError("Position must be provided to load JD")

    # safe escape for regex
    escaped = re.escape(position.strip())
    # JD model now uses job_title
    query = {"jd.job_title": {"$regex": f"^{escaped}$", "$options": "i"}}

    jd_doc = await job_description_collection.find_one(query)
    if jd_doc and "jd" in jd_doc:
        return JDExtractedData(**jd_doc["jd"])

    raise ValueError(f"No JD found for position '{position}'")
 
 
# ------------------ Helper Functions ------------------
def simple_normalize_skill(skill: str) -> str:
    """
    Basic normalization: lowercase and strip whitespace.
    Accept either string or object with skill_name.
    """
    if not skill:
        return ""
    if isinstance(skill, dict):
        skill = skill.get("skill_name") or skill.get("skill") or ""
    if hasattr(skill, "skill_name"):
        skill = getattr(skill, "skill_name")
    return str(skill).lower().strip()

def calculate_skill_overlap(resume_skills: list, jd_skills: list) -> tuple:
    """
    Simple set-based overlap calculation.
    Accepts lists of strings or objects (SkillEvidence / TechnicalSkill).
    Returns (matched_skills, overlap_count)
    """
    resume_normalized = {simple_normalize_skill(s) for s in (resume_skills or [])}
    jd_normalized = {simple_normalize_skill(s) for s in (jd_skills or [])}

    matched = resume_normalized & jd_normalized
    # filter out empty strings
    matched = {m for m in matched if m}
    return list(matched), len(matched)

def extract_years_from_text(text: str) -> float:
    """
    Extract years from experience strings or numeric fields.
    """
    if text is None:
        return 0.0
    # if the field is already numeric
    try:
        return float(text)
    except Exception:
        pass

    text = str(text).lower()
    match = re.search(r'(\d+(?:\.\d+)?)\s*(?:\+)?\s*years?', text)
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
async def compare_resume_with_jd(resume: ResumeExtractedData, position: str) -> MatchResult:
    jd = await load_jd(position)

    # Extract plain skill name lists for internal fallback scoring and LLM context
    resume_skill_names = []
    if getattr(resume, "skills_inventory", None):
        resume_skill_names = [getattr(s, "skill_name", "") for s in resume.skills_inventory]
    elif getattr(resume, "skills", None):
        resume_skill_names = resume.skills

    jd_skill_names = []
    if getattr(jd, "technical_skills", None):
        jd_skill_names = [getattr(s, "skill_name", "") for s in jd.technical_skills]
    elif getattr(jd, "skills", None):
        jd_skill_names = jd.skills

    # Prepare simple JSON strings for LLM context
    jd_json = jd.model_dump_json()
    resume_json = resume.model_dump_json()

    prompt_template = ChatPromptTemplate.from_template("""
You are an expert evaluator performing an Applicant Tracking System (ATS) matching process.

**INPUTS:**
- Extracted Job Description data:
{jd_data}

- Extracted Resume data:
{resume_data}

**GOAL:**
Produce a structured Match Result evaluating how well the candidate aligns with the JD requirements.

**OUTPUT STRUCTURE:**

## Part 1: Task-Specific Capability Assessment
For each major JD task:
- Task name
- Evidence from resume (project or role)
- Similarity type (Exact / Similar / Related)
- Confidence score (0–100)
- Comments

## Part 2: Sectional Match Scores
- Skills match score (based on overlap and proficiency)
- Experience relevance score
- Certification alignment score
- Education alignment score
- Deliverable execution score
- Overall fit score (weighted aggregate)

## Part 3: Gap & Risk Analysis
Identify and list:
- Critical gaps: completely missing requirements
- Moderate gaps: related or transferable skills present
- Trainable gaps: can be learned quickly
- Overqualification risks: candidate exceeds role scope

Return all results as structured JSON adhering strictly to the following pydantic schema:

class TaskMatch:
    jd_task: str
    evidence_from_resume: Optional[str]
    similarity_type: Optional[str]
    confidence_score: Optional[int]
    comments: Optional[str]

class SectionalMatchScores:
    skills_match_score: Optional[int]
    experience_relevance_score: Optional[int]
    certification_alignment_score: Optional[int]
    education_alignment_score: Optional[int]
    deliverable_execution_score: Optional[int]
    overall_fit_score: Optional[int]

class GapRiskAnalysis:
    critical_gaps: List[str]
    moderate_gaps: List[str]
    trainable_gaps: List[str]
    overqualification_risks: List[str]

class MatchResult:
    job_id: Optional[str]
    candidate_id: Optional[str]
    candidate_name: Optional[str]
    task_specific_matches: List[TaskMatch]
    sectional_scores: Optional[SectionalMatchScores]
    gap_risk_analysis: Optional[GapRiskAnalysis]
    overall_comments: Optional[str]
    generated_on: Optional[str]

Output only valid JSON.
""")

    chain = prompt_template | model
    response = await chain.ainvoke({
        "jd_data": jd_json,
        "resume_data": resume_json
    })

    # --- Parse LLM response with enhanced error handling ---
    try:
        parsed = safe_parse_llm_response(response)
    except Exception as e:
        print(f"[Warning] LLM response parsing failed: {e}")
        print(f"[Debug] Raw response: {response.content if hasattr(response, 'content') else response}")

        # Improved fallback with actual skill analysis
        matched_skills, overlap_count = calculate_skill_overlap(resume_skill_names, jd_skill_names)
        all_jd_skills_normalized = {simple_normalize_skill(s) for s in jd_skill_names}
        all_resume_skills_normalized = {simple_normalize_skill(s) for s in resume_skill_names}
        missing = list(all_jd_skills_normalized - all_resume_skills_normalized)

        parsed = {
            # Legacy fallback shape kept for repository compatibility:
            "match_score": 50,
            "matched_skills": matched_skills[:5] if matched_skills else resume_skill_names[:3],
            "missing_skills": missing[:5],
            "suitability": "Rejected",
            "reasoning": "System fallback: Unable to perform complete analysis. Manual review recommended."
        }

    # Determine llm_score from parsed if present, else fallback
    llm_score = parsed.get("match_score", 50)

    # Blend with in-house scoring
    final_score = evaluate_candidate(resume, jd, llm_score)
    parsed["match_score"] = int(round(final_score))

    # Enhanced decision logic with tiered system
    parsed["suitability"] = determine_suitability(final_score, resume, jd)

    # Attempt to construct MatchResult model: if LLM returned full structure, use it, otherwise use fallbacks
    # If parsed already matches MatchResult fields, this will initialize fine.
    return MatchResult(**parsed)
 
 
# ------------------ Enhanced In-house Evaluation ------------------
def evaluate_candidate(resume: ResumeExtractedData, jd: JDExtractedData, llm_score: float) -> float:
    """
    Enhanced evaluation combining skills, experience, and LLM assessment.
    """
    # Extract skill name lists
    resume_skill_names = [getattr(s, "skill_name", "") for s in getattr(resume, "skills_inventory", [])] if getattr(resume, "skills_inventory", None) else getattr(resume, "skills", []) or []
    jd_skill_names = [getattr(s, "skill_name", "") for s in getattr(jd, "technical_skills", [])] if getattr(jd, "technical_skills", None) else getattr(jd, "skills", []) or []

    matched_skills, overlap_count = calculate_skill_overlap(resume_skill_names, jd_skill_names)
    total_skills = len(jd_skill_names) if jd_skill_names else 1
    skill_score = (overlap_count / total_skills) * 100

    # Experience scoring: use total_experience_years on resume and experience_requirements on JD
    resume_experience = getattr(resume, 'total_experience_years', '') or getattr(resume, 'total_experience', '')
    jd_experience = getattr(jd, 'experience_requirements', None)
    if jd_experience:
        jd_exp_val = getattr(jd_experience, 'total_experience_years', '') or getattr(jd_experience, 'relevant_experience_years', '')
    else:
        jd_exp_val = ''

    exp_score = calculate_experience_score(resume_experience, jd_exp_val)

    final_score = (0.4 * skill_score) + (0.3 * exp_score) + (0.3 * float(llm_score or 0))
    return round(final_score, 2)

def determine_suitability(final_score: float, resume: ResumeExtractedData, jd: JDExtractedData) -> str:
    """
    Multi-tier decision making for better accuracy.
    """
    if final_score >= 70:
        return "Shortlisted"
    elif final_score >= 50:
        return "Shortlisted"
    elif final_score >= 30:
        # Secondary check: Must have minimum core skills
        resume_skill_names = [getattr(s, "skill_name", "") for s in getattr(resume, "skills_inventory", [])] if getattr(resume, "skills_inventory", None) else getattr(resume, "skills", []) or []
        jd_skill_names = [getattr(s, "skill_name", "") for s in getattr(jd, "technical_skills", [])] if getattr(jd, "technical_skills", None) else getattr(jd, "skills", []) or []
        matched_skills, overlap_count = calculate_skill_overlap(resume_skill_names, jd_skill_names)
        total_skills = len(jd_skill_names) if jd_skill_names else 1
        skill_match_percentage = (overlap_count / total_skills) * 100

        if skill_match_percentage >= 40:
            return "Shortlisted"
        else:
            return "Rejected"
    else:
        return "Rejected"