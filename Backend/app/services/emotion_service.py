"""
Emotion detection service using Google Gemini API with fallback.
Detects and classifies emotions from user messages.
"""

import json
import google.generativeai as genai
from typing import Dict, Any
from app.core.config import GOOGLE_API_KEY

# Configure Gemini with API key
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)


class EmotionService:
    """Service for detecting emotions in user messages using Gemini."""
    
    # Keyword patterns for fallback emotion detection
    EMOTION_KEYWORDS = {
        "anger": ["infuriating", "furious", "angry", "rage", "mad", "damn", "hate", "terrible", "awful", "horrible"],
        "frustration": ["frustrated", "annoying", "irritating", "exasperating", "grrr", "ugh", "argh"],
        "anxiety": ["worried", "anxious", "nervous", "panic", "scared", "afraid", "terrified", "stressed"],
        "sadness": ["sad", "depressed", "miserable", "unhappy", "devastated", "heartbroken", "gloomy", "down"],
        "joy": ["happy", "excited", "glad", "delighted", "thrilled", "wonderful", "amazing", "fantastic", "great"],
        "calm": ["calm", "peaceful", "relaxed", "serene", "tranquil", "content", "ok", "fine"],
        "fear": ["scared", "frightened", "terrified", "horrified", "dread", "fearful"],
        "loneliness": ["lonely", "alone", "isolated", "abandoned", "left", "forgotten"],
        "hopelessness": ["hopeless", "despair", "give up", "pointless", "worthless", "no point"],
        "stress": ["stressed", "stressed out", "overwhelmed", "pressure", "tense", "tight"],
    }
    
    def __init__(self):
        """Initialize the Emotion Service."""
        # Use gemini-1.5-flash for faster responses and lower cost
        self.model = genai.GenerativeModel("gemini-1.5-flash")
    
    def _fallback_emotion_detection(self, message: str) -> Dict[str, Any]:
        """
        Fallback keyword-based emotion detection when API fails.
        
        Args:
            message: User's message text
            
        Returns:
            Dict with emotion, confidence, and reasoning
        """
        message_lower = message.lower()
        emotion_scores = {}
        
        for emotion, keywords in self.EMOTION_KEYWORDS.items():
            matches = sum(1 for keyword in keywords if keyword in message_lower)
            if matches > 0:
                emotion_scores[emotion] = matches
        
        if emotion_scores:
            # Get the emotion with the highest match count
            detected_emotion = max(emotion_scores, key=emotion_scores.get)
            max_score = emotion_scores[detected_emotion]
            # Confidence based on keyword matches (scale to 0-1)
            confidence = min(max_score / 3.0, 0.9)  # Cap at 0.9 for fallback
            
            return {
                "emotion": detected_emotion,
                "confidence": confidence,
                "reasoning": f"Fallback detection: {max_score} keyword match(es)"
            }
        
        return {
            "emotion": "neutral",
            "confidence": 0.5,
            "reasoning": "No strong emotional indicators detected"
        }
    
    def detect_emotion(self, message: str) -> Dict[str, Any]:
        """
        Detect emotion from user message using Gemini API with fallback.
        
        Args:
            message: User's message text
            
        Returns:
            Dict with emotion, confidence, and reasoning
        """
        prompt = f"""Analyze the emotional tone of this message and classify it into one emotion category.

Message: "{message}"

Respond with ONLY valid JSON (no markdown, no extra text, no backticks):
{{"emotion": "one of [sadness, anxiety, anger, fear, loneliness, hopelessness, stress, joy, calm, frustration, neutral]", "confidence": 0.0, "reasoning": "brief explanation"}}"""
        
        try:
            response = self.model.generate_content(prompt)
            
            if not response or not response.text:
                print(f"Empty Gemini response, using fallback")
                return self._fallback_emotion_detection(message)
            
            # Extract JSON from response
            response_text = response.text.strip()
            print(f"Gemini raw response: {response_text}")
            
            # Remove markdown code blocks if present
            if response_text.startswith("```"):
                response_text = response_text.split("```")[1]
                if response_text.startswith("json"):
                    response_text = response_text[4:]
                response_text = response_text.strip()
            
            # Try to find JSON object in response
            json_start = response_text.find("{")
            json_end = response_text.rfind("}") + 1
            if json_start >= 0 and json_end > json_start:
                response_text = response_text[json_start:json_end]
            
            print(f"Extracted JSON: {response_text}")
            result = json.loads(response_text)
            
            emotion = result.get("emotion", "neutral")
            confidence = result.get("confidence", 0.5)
            reasoning = result.get("reasoning", "")
            
            # Validate emotion is in allowed list
            allowed_emotions = ["sadness", "anxiety", "anger", "fear", "loneliness", 
                              "hopelessness", "stress", "joy", "calm", "frustration", "neutral"]
            if emotion not in allowed_emotions:
                print(f"Invalid emotion detected: {emotion}, using fallback")
                return self._fallback_emotion_detection(message)
            
            print(f"Detected emotion: {emotion}, confidence: {confidence}")
            
            return {
                "emotion": emotion,
                "confidence": confidence,
                "reasoning": reasoning
            }
        except json.JSONDecodeError as e:
            print(f"JSON parsing error in emotion detection: {e}, using fallback")
            print(f"Failed to parse: {response_text if 'response_text' in locals() else 'N/A'}")
            return self._fallback_emotion_detection(message)
        except Exception as e:
            print(f"Error detecting emotion: {type(e).__name__}: {e}, using fallback")
            import traceback
            traceback.print_exc()
            return self._fallback_emotion_detection(message)
