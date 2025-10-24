import json
from pathlib import Path
from ats_module.models.jd_model import JobDescription

JD_FILE = Path(__file__).parent.parent / "data" / "jd.json"

def parse_jd() -> JobDescription:
    with open(JD_FILE, "r", encoding="utf-8") as f:
        jd_data = json.load(f)
    # Parse JSON into Pydantic model
    return JobDescription(**jd_data)
