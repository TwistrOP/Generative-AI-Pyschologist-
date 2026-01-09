# config.py

import os
from dotenv import load_dotenv

load_dotenv()

# ==============================================================================
# API KEYS & MODEL CONFIGURATIONS
# ==============================================================================

# Get API keys from environment variables
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")  

# Define the ID for the generative model on Groq
GENERATIVE_MODEL_ID = "llama-3.1-8b-instant"

# ==============================================================================
# HUGGING FACE INFERENCE API CONFIGURATIONS
# ==============================================================================
# API URLs for the models, replacing the local model IDs
# We use these endpoints to call the models via API instead of loading them locally
API_BASE_URL = "https://api-inference.huggingface.co/models/"
MODERATION_API_URL = API_BASE_URL + "facebook/roberta-hate-speech-dynabench-r4-target"
SENTIMENT_API_URL = API_BASE_URL + "cardiffnlp/twitter-roberta-base-sentiment-latest"
EMOTION_API_URL = API_BASE_URL + "bhadresh-savani/distilbert-base-uncased-emotion"


# ==============================================================================
# ENHANCED CRISIS & CONCERN PATTERNS
# ==============================================================================
# These patterns remain the same, as they are based on regular expressions
CRISIS_PATTERNS = [
    r"\bi (want to|wanna|'m going to|gonna|will|plan to|need to|am going to) (die|kill myself|k.m.s|end it all|end my life)\b",
    r"\bi'm going to (kill myself|end my life)\b",
    r"\bi can't (go on|live|take it) (like this )?anymore\b",
    r"\b(i'm|i am) (seriously|really) thinking of suicide\b",
    r"\bplanning to end my life\b",
    r"\b(i've|i have) taken (pills|medication) to end my life\b",
    r"\bi have a plan to kill myself\b"
]

CONCERN_PATTERNS = [
    r"\bi've been feeling (really )?(depressed|suicidal)\b",
    r"\bi (sometimes|often) think about (dying|self-harm)\b",
    r"\b(i'm|i am) struggling with (suicidal thoughts|self-harm)\b",
    r"\bno reason to live\b",
    r"\bdon't want to be here anymore\b",
    r"\bi feel (so )?(hopeless|trapped|worthless|empty|numb)\b"
]

# ==============================================================================
# CBT COGNITIVE DISTORTION PATTERNS & INTERVENTIONS
# ==============================================================================
CBT_PATTERNS = {
    'catastrophizing': r"\b(everything is|always|never|worst|ruined|hopeless|disaster|catastrophe)\b",
    'all_or_nothing': r"\b(all|nothing|completely|totally|failure|useless|perfect|impossible)\b",
    'overgeneralization': r"\b(everyone|nobody|always|never|every time|no one ever)\b",
    'personalization': r"\b(my fault|blame myself|because of me|i caused|i'm responsible)\b"
}

CBT_INTERVENTIONS = {
    'catastrophizing': [
        "Could you try identifying one piece of evidence that things might not be as bad as they seem?",
        "When we imagine the worst, it helps to ask: 'What's the most likely outcome?' Can you think of that?",
    ],
    'all_or_nothing': [
        "It seems like you're seeing things as all good or all bad. Can you think of a middle ground or small positive aspect?",
        "Life is rarely 100% one way or another. What's one small step you could take that isn't all-or-nothing?",
    ],
    'overgeneralization': [
        "You mentioned words like 'always' or 'never.' Could you reflect on a time when things were different?",
        "One experience doesn't define all experiences. Can you think of a time when this wasn't true for you?",
    ],
    'personalization': [
        "You seem to be taking a lot of responsibility for this. Can you consider other factors that might be contributing?",
        "Not everything that happens is because of us. What else might be influencing this situation?",
    ]
}

# ==============================================================================
# GENERAL & RESOURCE CONFIGS
# ==============================================================================
GENERAL_CBT_TECHNIQUES = [
    "Try a grounding exercise: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.",
    "Deep breathing can help: Inhale for 4 counts, hold for 4, exhale for 4, repeat 3 times.",
]

MENTAL_HEALTH_RESOURCES = {
    'crisis': [
        "**National Suicide Prevention Lifeline (US)**: Call or text 988 (24/7)",
        "**Crisis Text Line**: Text HOME to 741741 (24/7)",
    ],
    'concern': [
        "**SAMHSA National Helpline (US)**: 1-800-662-HELP (4357) (24/7)",
        "**7 Cups (free online therapy)**: https://www.7cups.com",
    ]
}

ANTI_REPETITION_STARTERS = [
    "Of course I'm here to help",
    "I'm here for you",
    "I understand how difficult",
    "That sounds really tough",
    "Thank you for sharing",
    "It's completely normal to"
]

print("API-based configuration file loaded successfully.")