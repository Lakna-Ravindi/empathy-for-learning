from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import json
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Gemini setup
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# List available models
print("\n=== Available Models ===")
for model in genai.list_models():
    print(f"- {model.name}")
print("=======================\n")

model_llm = genai.GenerativeModel("gemini-2.0-flash")

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

    # Step 1: Retrieve context
    query_vector = embed_model.encode([user_message])

    D, I = index.search(np.array(query_vector).astype("float32"), k=1)

    best_match = documents[I[0][0]]["metadata"]

    # Step 2: Build prompt
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

    # Step 3: Gemini response
    try:
        response = model_llm.generate_content(prompt)
        reply = response.text
    except Exception as e:
        # Fallback response when quota is exceeded or API fails
        error_msg = str(e).lower()
        if "quota" in error_msg or "resource exhausted" in error_msg:
            reply = f"I'm currently experiencing high usage limits. Here's what I can tell you about {best_match['skill']}: {best_match['description']}\n\nTry again in a few moments, or consider taking a mindful break."
        else:
            reply = "I'm having trouble connecting right now. Please try again in a moment."

    return {
        "reply": reply,
        "skill": best_match["skill"],
        "activities": best_match["activities"]
    }