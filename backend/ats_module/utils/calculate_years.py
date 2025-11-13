from dateutil import parser
from datetime import datetime

def calculate_experience_years(work_experience_list):
    total_months = 0
    today = datetime.now()

    for exp in work_experience_list:
        start = exp.start_date
        end = exp.end_date

        # Parse start date
        try:
            start_dt = parser.parse(start)
        except:
            continue  # skip if can't parse

        # Parse end date or handle "Present"
        if end is None or str(end).lower() in ["present", "current", "ongoing"]:
            end_dt = today
        else:
            try:
                end_dt = parser.parse(end)
            except:
                continue

        # Calculate months difference
        diff_months = (end_dt.year - start_dt.year) * 12 + (end_dt.month - start_dt.month)
        if diff_months < 0:
            continue  # avoid negative durations

        total_months += diff_months

    # Convert to years
    total_years = round(total_months / 12, 2)
    return total_years
