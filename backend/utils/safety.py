# backend/utils/safety.py
CRISIS_RESOURCES = {
    "global_helpline": "If you are in immediate danger please contact your local emergency services.",
    "suicide_hotline_us": "National Suicide Prevention Lifeline (U.S.): 988",
    "message": "This tool is NOT a medical device. If you have suicidal thoughts or feel like harming yourself, please seek immediate professional help."
}

def check_risk(text_analysis: dict) -> dict:
    """
    Returns whether escalation is needed and a suggested message.
    """
    if text_analysis.get("risk"):
        return {"escalate": True, "resources": CRISIS_RESOURCES}
    return {"escalate": False}
