# processing.py
import re
import random
import logging
from models import query_huggingface_api  
from config import (
    CRISIS_PATTERNS, CONCERN_PATTERNS,
    CBT_PATTERNS, CBT_INTERVENTIONS, GENERAL_CBT_TECHNIQUES, ANTI_REPETITION_STARTERS,
    MODERATION_API_URL, SENTIMENT_API_URL, EMOTION_API_URL  
)

logger = logging.getLogger(__name__)

def sanitize_input(text):
    """Enhanced sanitization to clean input text. (No changes here)"""
    if not text:
        return ""
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'[^\w\s.,!?\'"-]', '', text)
    max_length = 1000
    if len(text) > max_length:
        text = text[:max_length] + "... [truncated]"
    return text.strip()

def moderate_text(text):
    """
    Moderates text by calling the Hugging Face Inference API.
    """
    try:
        api_response = query_huggingface_api(MODERATION_API_URL, text)
        if not api_response:
            return {'is_harmful': False, 'score': 0.0}

        # Find the score for the 'hate' label
        harmful_score = 0.0
        for item in api_response[0]:
            if item['label'] == 'hate':
                harmful_score = item['score']
                break
        
        logger.info(f"Moderation score from API: {harmful_score:.3f}")
        return {'is_harmful': harmful_score > 0.7, 'score': harmful_score}
    except Exception as e:
        logger.error(f"Error processing moderation API response: {e}")
        return {'is_harmful': False, 'score': 0.0}


def enhanced_crisis_detection(text):
    """Enhanced crisis detection with expanded patterns. (No changes here)"""
    if not text:
        return None
    text_lower = text.lower()
    for pattern in CRISIS_PATTERNS:
        if re.search(pattern, text_lower):
            logger.warning(f"Crisis pattern detected: {pattern}")
            return "crisis"
    for pattern in CONCERN_PATTERNS:
        if re.search(pattern, text_lower):
            logger.info(f"Concern pattern detected: {pattern}")
            return "concern"
    return None

def detect_cbt_patterns(text):
    """Detect cognitive distortions using CBT patterns. (No changes here)"""
    if not text:
        return []
    text_lower = text.lower()
    detected_patterns = []
    for pattern_name, regex in CBT_PATTERNS.items():
        if re.search(regex, text_lower):
            detected_patterns.append(pattern_name)
    return detected_patterns

def generate_cbt_intervention(detected_patterns, emotions):
    """Generate targeted CBT intervention. (No changes here)"""
    if detected_patterns:
        primary_pattern = detected_patterns[0]
        interventions = CBT_INTERVENTIONS.get(primary_pattern, [])
        if interventions:
            return random.choice(interventions)
    return random.choice(GENERAL_CBT_TECHNIQUES)


def analyze_conversation_patterns(history):
    """Analyze conversation history for repetitive patterns. (No changes here)"""
    if not history:
        return []
    assistant_responses = [msg['content'] for msg in history if msg['role'] == 'assistant']
    repetitive_phrases = []
    for phrase in ANTI_REPETITION_STARTERS:
        count = sum(1 for response in assistant_responses if phrase.lower() in response.lower())
        if count > 1 and count > len(assistant_responses) * 0.3:
            repetitive_phrases.append(phrase)
    return repetitive_phrases

def combined_sentiment_analysis(text, history=None):
    """
    Combines all analysis steps into one function, using API calls for ML tasks.
    """
    try:
        # Get sentiment from API
        sentiment_response = query_huggingface_api(SENTIMENT_API_URL, text)
        if sentiment_response:
            sentiment_result = max(sentiment_response[0], key=lambda x: x['score'])
            sentiment_label = sentiment_result['label'].lower()
            sentiment_score = sentiment_result['score']
        else:
            sentiment_label, sentiment_score = 'unknown', 0.0

        # Get emotions from API
        emotion_response = query_huggingface_api(EMOTION_API_URL, text)
        if emotion_response:
            # Filter emotions with a score > 0.1 and sort them
            emotions = sorted([res for res in emotion_response[0] if res['score'] > 0.1], key=lambda x: x['score'], reverse=True)
        else:
            emotions = []

        # The following functions are regex/logic-based and do not need API calls
        detected_patterns = detect_cbt_patterns(text)
        cbt_intervention = generate_cbt_intervention(detected_patterns, emotions)
        urgency_level = enhanced_crisis_detection(text)
        
        # Override sentiment if urgency is detected
        if urgency_level:
            sentiment_label = 'crisis' if urgency_level == 'crisis' else 'concern'

        repetitive_patterns = analyze_conversation_patterns(history) if history else []

        result = {
            'sentiment': sentiment_label,
            'sentiment_score': sentiment_score,
            'emotions': emotions,
            'cbt_analysis': {
                'patterns': detected_patterns,
                'intervention': cbt_intervention,
                'repetitive_patterns': repetitive_patterns
            },
            'urgency_level': urgency_level,
        }
        logger.info(f"API-based analysis complete: {result}")
        return result
        
    except Exception as e:
        logger.error(f"Error in combined_sentiment_analysis (API version): {e}")
        # Return a default structure on error
        return {
            'sentiment': 'unknown', 'sentiment_score': 0.0, 'emotions': [],
            'cbt_analysis': {'patterns': [], 'intervention': None, 'repetitive_patterns': []},
            'urgency_level': None
        }

def generate_anti_repetition_instruction(repetitive_patterns):
    """Generate instruction to avoid repetitive patterns. (No changes here)"""
    if not repetitive_patterns:
        return ""
    patterns_text = ', '.join([f"'{p}'" for p in repetitive_patterns[:3]])
    return f"Avoid these repetitive starters from history: {patterns_text}. Use varied openings."