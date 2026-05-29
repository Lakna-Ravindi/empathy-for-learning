from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import json
import google.genai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Gemini setup - using new google.genai Client API
genai_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL_NAME = "gemini-2.0-flash"

# Embedding model
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

# Load SEEK data
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "seek_data.json")

with open(DATA_PATH, "r") as f:
    data = json.load(f)

# Prepare documents
documents = []

for item in data:
    text = f"""
    Skill: {item['skill']}
    Description: {item['description']}
    Emotions: {', '.join(item['emotions'])}
    Concepts: {', '.join(item['concepts'])}
    """

    documents.append({
        "text": text,
        "metadata": item
    })

texts = [d["text"] for d in documents]

# Create embeddings
embeddings = embed_model.encode(texts)

# FAISS index
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(np.array(embeddings).astype("float32"))


# ========== CORE FUNCTION ==========
def get_seek_response(user_message: str, emotion: str = "General"):

    # Step 1: Retrieve context with enhanced query (emotion + message)
    # This improves retrieval quality by including emotional context
    enhanced_query = f"Emotion: {emotion}. User message: {user_message}"
    query_vector = embed_model.encode([enhanced_query])

    D, I = index.search(np.array(query_vector).astype("float32"), k=1)

    best_match = documents[I[0][0]]["metadata"]

    # Step 2: Build prompt for Gemini
    prompt = f"""
You are a SEEK emotional wellness assistant.

Rules:
- Do not act like therapist
- Use calm supportive tone
- Use SEEK concepts only
- Suggest grounding or mindfulness
- Never diagnose mental illness
- Keep response under 120 words

Detected emotion:
{emotion}

Relevant skill:
{best_match['skill']}

User:
"{user_message}"

Respond in a calm supportive way using grounding techniques.
"""

    # Step 3: Try Gemini first, fall back to local response if API fails
    try:
        response = genai_client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )
        reply = response.text
    except Exception as e:
        # Log error for debugging
        print(f"Gemini API Error: {e}")
        
        # Hybrid fallback: Use local template-based response with SEEK data
        error_msg = str(e).lower()
        
        # Get activities for suggestions
        activities = best_match.get('activities', [])
        activity_suggestions = ""
        if activities:
            activity_suggestions = "\n".join([f"• {activity}" for activity in activities[:2]])
        
        # Generate intelligent local response
        reply = f"""It sounds like you're experiencing {emotion.lower()} feelings right now.

A helpful SEEK technique from "{best_match['skill']}" is to try:
{activity_suggestions}

Take a slow breath and focus on one physical sensation around you. Notice what you see, hear, or feel. Small grounding steps can help bring your mind back to the present moment.

Remember: You're not alone in this experience."""

    return {
        "reply": reply,
        "skill": best_match["skill"],
        "activities": best_match["activities"]
    }