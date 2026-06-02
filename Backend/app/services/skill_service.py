"""
Skill mapping service.
Maps detected emotions to appropriate skills from the knowledge base.
"""

import json
import os
from typing import Dict, Any, Optional


class SkillService:
    """Service for mapping emotions to skills."""
    
    def __init__(self):
        """Initialize the Skill Service and load skills database."""
        self.skills_path = os.path.join(
            os.path.dirname(__file__),
            "../knowledge/skills.json"
        )
        self.skills = self._load_skills()
    
    def _load_skills(self) -> list:
        """
        Load skills database from JSON file.
        
        Returns:
            List of skill configurations
        """
        try:
            if os.path.exists(self.skills_path):
                with open(self.skills_path, "r") as f:
                    return json.load(f)
            else:
                print(f"Skills file not found at {self.skills_path}")
                return self._get_default_skills()
        except Exception as e:
            print(f"Error loading skills: {e}")
            return self._get_default_skills()
    
    def get_skill(self, emotion: str) -> Optional[Dict[str, Any]]:
        """
        Get the appropriate skill for a given emotion.
        
        Args:
            emotion: Detected emotion
            
        Returns:
            Skill configuration dict or None if not found
        """
        emotion_lower = emotion.lower()
        
        for skill in self.skills:
            emotions = [e.lower() for e in skill.get("emotions", [])]
            if emotion_lower in emotions:
                return skill
        
        return None
    
    def get_all_skills(self) -> list:
        """
        Get all available skills.
        
        Returns:
            List of all skills
        """
        return self.skills
    
    def _get_default_skills(self) -> list:
        """
        Get default skills configuration if file not found.
        
        Returns:
            Default skills list
        """
        return [
            {
                "skill_id": "breathing",
                "skill": "Breathing Exercises",
                "emotions": ["anxiety", "stress", "fear"],
                "ai_guidance": {
                    "tone": "calm and supportive",
                    "focus": "grounding and relaxation"
                },
                "description": "Guided breathing exercises to reduce anxiety"
            },
            {
                "skill_id": "grounding",
                "skill": "Grounding Techniques",
                "emotions": ["anxiety", "panic", "fear"],
                "ai_guidance": {
                    "tone": "reassuring and present",
                    "focus": "sensory awareness and presence"
                },
                "description": "5-4-3-2-1 sensory technique and other grounding methods"
            },
            {
                "skill_id": "cognitive_reframe",
                "skill": "Cognitive Reframing",
                "emotions": ["anxiety", "stress", "hopelessness", "frustration"],
                "ai_guidance": {
                    "tone": "curious and encouraging",
                    "focus": "perspective shifting"
                },
                "description": "Challenge and reframe unhelpful thinking patterns"
            },
            {
                "skill_id": "social_connection",
                "skill": "Social Connection",
                "emotions": ["loneliness", "isolation", "sadness"],
                "ai_guidance": {
                    "tone": "warm and inclusive",
                    "focus": "connection and belonging"
                },
                "description": "Tips for reaching out and building meaningful connections"
            },
            {
                "skill_id": "self_compassion",
                "skill": "Self-Compassion",
                "emotions": ["sadness", "hopelessness", "frustration", "anger"],
                "ai_guidance": {
                    "tone": "gentle and supportive",
                    "focus": "self-kindness and acceptance"
                },
                "description": "Developing compassion towards yourself during difficult times"
            },
            {
                "skill_id": "mindfulness",
                "skill": "Mindfulness",
                "emotions": ["stress", "anxiety", "sadness"],
                "ai_guidance": {
                    "tone": "peaceful and present",
                    "focus": "awareness and acceptance"
                },
                "description": "Mindfulness meditation and present moment awareness"
            }
        ]
