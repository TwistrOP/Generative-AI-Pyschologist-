# models.py
import requests
import logging
from config import HUGGINGFACE_API_KEY

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# This is the helper function that will call the Hugging Face Inference API
def query_huggingface_api(api_url: str, text: str):
    """
    Sends a request to a specified Hugging Face Inference API endpoint.
    
    Args:
        api_url (str): The URL of the model's API endpoint.
        text (str): The input text to be analyzed.
        
    Returns:
        dict: The JSON response from the API, or None if an error occurs.
    """
    if not HUGGINGFACE_API_KEY:
        logger.error("HUGGINGFACE_API_KEY not found. Cannot query API.")
        return None

    headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
    payload = {"inputs": text}
    
    try:
        response = requests.post(api_url, headers=headers, json=payload, timeout=10)
        response.raise_for_status()  
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"API request to {api_url} failed: {e}")
        return None
