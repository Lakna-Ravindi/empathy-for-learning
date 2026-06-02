"""
Gemini AI service for generating empathetic responses.
Builds and executes prompts using Google's Gemini API.
"""

import google.generativeai as genai
from typing import Dict, Any, List, Optional
from app.core.config import GOOGLE_API_KEY

# Configure Gemini with API key
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)


class GeminiService:
    """Service for interacting with Google Gemini API."""
    
    SYSTEM_PROMPT = """You are SEEK, an empathetic emotional support assistant. Your role is to:

1. Listen with empathy and validation
2. Help users understand and process their emotions
3. Provide practical coping strategies
4. Encourage healthy responses to difficult emotions
5. Know when to suggest professional help

Guidelines:
- Use warm, supportive language
- Be non-judgmental and accepting
- Validate their feelings
- Offer practical suggestions
- Keep responses concise but meaningful
- Never dismiss or minimize emotions
- Encourage self-compassion

If the user mentions crisis/emergency situations, prioritize their safety."""
    
    def __init__(self, model_name: str = "gemini-1.5-flash"):
        """
        Initialize the Gemini Service.
        
        Args:
            model_name: Name of the Gemini model to use
        """
        self.model_name = model_name
        self.model = genai.GenerativeModel(model_name)
        self.generation_config = genai.types.GenerationConfig(
            temperature=0.7,
            top_p=0.95,
            max_output_tokens=500
        )
    
    def build_prompt(
        self,
        message: str,
        emotion: Dict[str, Any],
        skill: Optional[Dict[str, Any]],
        context: List[Dict[str, Any]]
    ) -> str:
        """
        Build a comprehensive prompt for Gemini.
        
        Args:
            message: User's message
            emotion: Detected emotion info
            skill: Recommended skill
            context: Retrieved knowledge chunks
            
        Returns:
            Formatted prompt string
        """
        prompt = self.SYSTEM_PROMPT + "\n\n"
        
        # Add context from emotion detection
        prompt += f"User's Emotion: {emotion.get('emotion', 'unknown')} "
        prompt += f"(confidence: {emotion.get('confidence', 0):.0%})\n"
        
        # Add recommended skill guidance
        if skill:
            prompt += f"\nRecommended Approach: {skill.get('skill', '')}\n"
            guidance = skill.get('ai_guidance', {})
            if guidance.get('tone'):
                prompt += f"Tone: {guidance['tone']}\n"
            if guidance.get('focus'):
                prompt += f"Focus: {guidance['focus']}\n"
        
        # Add relevant knowledge
        if context:
            prompt += "\nRelevant Information:\n"
            for i, chunk in enumerate(context[:3], 1):
                prompt += f"• {chunk.get('content', '')}\n"
        
        # Add user message
        prompt += f"\nUser Message:\n\"{message}\"\n\n"
        prompt += "Provide a supportive, empathetic response that:"
        prompt += "\n1. Validates their feelings"
        prompt += "\n2. Offers practical coping strategies"
        prompt += "\n3. Encourages self-compassion"
        prompt += "\n4. Keeps response concise (2-3 paragraphs max)\n"
        
        return prompt
    
    def generate(
        self,
        prompt: str,
        temperature: float = 0.7
    ) -> str:
        """
        Generate a response using Gemini.
        
        Args:
            prompt: The prompt to send to Gemini
            temperature: Controls randomness (0.0-1.0)
            
        Returns:
            Generated response text
        """
        try:
            config = genai.types.GenerationConfig(
                temperature=temperature,
                top_p=0.95,
                max_output_tokens=500
            )
            
            response = self.model.generate_content(
                prompt,
                generation_config=config
            )
            
            return response.text.strip()
        except Exception as e:
            print(f"Error generating response: {e}")
            return "I'm here to listen. Could you tell me more about what you're feeling?"
    
    def generate_structured(
        self,
        prompt: str,
        output_format: str = "text"
    ) -> Dict[str, Any]:
        """
        Generate a structured response (JSON format).
        
        Args:
            prompt: The prompt to send to Gemini
            output_format: Expected output format (text, json)
            
        Returns:
            Parsed response as dictionary
        """
        try:
            formatted_prompt = prompt + f"\nRespond in {output_format} format only."
            response = self.generate(formatted_prompt)
            
            if output_format == "json":
                import json
                return json.loads(response)
            
            return {"response": response}
        except Exception as e:
            print(f"Error generating structured response: {e}")
            return {"error": str(e)}
