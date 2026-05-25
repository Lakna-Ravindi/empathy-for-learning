// src/pages/ChatPage.jsx
// src/pages/ChatPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, PlayCircle, Award, TrendingUp, Menu, X, BookOpen } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';

const EIGHT_SKILLS = [
  { id: 1, name: "Calming the Body and Mind", icon: "🧘", color: "emerald" },
  { id: 2, name: "Ethical Mindfulness", icon: "🌱", color: "teal" },
  { id: 3, name: "Emotional Awareness", icon: "❤️", color: "rose" },
  { id: 4, name: "Self-Compassion", icon: "🤗", color: "amber" },
  { id: 5, name: "Impartiality and Common Humanity", icon: "🌍", color: "blue" },
  { id: 6, name: "Forgiveness and Gratitude", icon: "🙏", color: "violet" },
  { id: 7, name: "Empathic Concern", icon: "🤝", color: "cyan" },
  { id: 8, name: "Compassion", icon: "💖", color: "pink" },
];

const ChatPage = () => {
  const { user } = useAuthStore();
  const { messages, addMessage, clearChat, currentSkill, setCurrentSkill } = useChatStore();

  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState(currentSkill || EIGHT_SKILLS[0]);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    addMessage({
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    });

    setInput('');

    // Simulate AI response (replace later with API call)
    setTimeout(() => {
      addMessage({
        id: Date.now() + 1,
        role: 'assistant',
        content: `Thank you for your message. I'm happy to help you explore **${selectedSkill.name}** from the SEEK framework.`,
        timestamp: new Date(),
      });
    }, 700);
  };

  const handleSkillSelect = (skill) => {
    setSelectedSkill(skill);
    setCurrentSkill(skill);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 border-r bg-white flex flex-col overflow-hidden`}>
        <div className="p-4 border-b flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            S
          </div>
          <div>
            <h1 className="font-bold text-2xl text-slate-800">SEEK</h1>
            <p className="text-xs text-slate-500 -mt-1">Empathy Learning</p>
          </div>
        </div>

        <div className="p-4">
          <button
            onClick={clearChat}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-2xl font-medium transition-all"
          >
            <Plus size={20} /> New Chat
          </button>
        </div>

        <div className="px-4">
          <div className="uppercase text-xs font-semibold text-slate-500 mb-3 px-3">Empathy Skills</div>
          <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-2">
            {EIGHT_SKILLS.map((skill) => (
              <button
                key={skill.id}
                onClick={() => handleSkillSelect(skill)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left hover:bg-slate-100 transition-all ${
                  selectedSkill.id === skill.id ? 'bg-teal-50 border border-teal-200' : ''
                }`}
              >
                <span className="text-2xl">{skill.icon}</span>
                <span className="text-sm font-medium text-slate-700">{skill.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b bg-white px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedSkill.icon}</span>
              <div>
                <h2 className="font-semibold text-lg">{selectedSkill.name}</h2>
                <p className="text-xs text-teal-600">SEEK Framework</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-8xl mb-6 opacity-70">{selectedSkill.icon}</div>
              <h3 className="text-3xl font-semibold text-slate-700 mb-3">Hello, {user?.name || "Student"}</h3>
              <p className="text-slate-600 max-w-md">
                How can I help you develop your <span className="font-medium text-teal-600">{selectedSkill.name}</span> today?
              </p>
            </div>
          ) : (
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
          )}
        </div>

        {/* Input */}
        <div className="p-6 border-t bg-white">
          <ChatInput input={input} setInput={setInput} onSend={handleSend} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

/*import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, BookOpen, PlayCircle, Award, TrendingUp, Menu, X } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import Sidebar from '../components/common/Sidebar';

const EIGHT_SKILLS = [
  { id: 1, name: "Calming the Body and Mind", icon: "🧘", color: "emerald" },
  { id: 2, name: "Ethical Mindfulness", icon: "🌱", color: "teal" },
  { id: 3, name: "Emotional Awareness", icon: "❤️", color: "rose" },
  { id: 4, name: "Self-Compassion", icon: "🤗", color: "amber" },
  { id: 5, name: "Impartiality and Common Humanity", icon: "🌍", color: "blue" },
  { id: 6, name: "Forgiveness and Gratitude", icon: "🙏", color: "violet" },
  { id: 7, name: "Empathic Concern", icon: "🤝", color: "cyan" },
  { id: 8, name: "Compassion", icon: "💖", color: "pink" },
];

const ChatPage = () => {
  const { user } = useAuthStore();
  const { messages, addMessage, clearChat, currentSkill, setCurrentSkill } = useChatStore();
  
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'activities' | 'quizzes'
  const [selectedSkill, setSelectedSkill] = useState(currentSkill || EIGHT_SKILLS[0]);
  
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInput('');

    // Simulate AI thinking (replace with actual API call later)
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Thank you for sharing that. Let's explore this through the lens of **${selectedSkill.name}**. 

This is connected to the SEEK framework. Would you like me to:
1. Explain the key concepts with examples
2. Share a short reflective activity
3. Show a related video clip
4. Guide you through a guided practice?`,
        timestamp: new Date(),
        suggestions: ["Explain key concepts", "Start activity", "Watch video", "Practice exercise"],
      };
      addMessage(botResponse);
    }, 800);
  };

  const handleSkillSelect = (skill) => {
    setSelectedSkill(skill);
    setCurrentSkill(skill);
    // In real app, you would load skill-specific context or start new chat thread
    if (messages.length > 3) {
      if (confirm("Switching skill will start a fresh conversation. Continue?")) {
        clearChat();
      }
    }
  };

  const startActivity = (type) => {
    // This would open modal or navigate to activity
    alert(`Starting ${type} for ${selectedSkill.name}. This would open video/activity in real implementation.`);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
     // {/* Sidebar 
      <div className={`${isSidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 border-r border-slate-200 bg-white flex flex-col overflow-hidden`}>
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-linear-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <div>
              <h1 className="font-semibold text-xl text-slate-800">SEEK Chat</h1>
              <p className="text-xs text-slate-500">Empathy for A/L & Uni Students</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-slate-500 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* New Chat 
        <div className="p-4">
          <button 
            onClick={() => { clearChat(); }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-medium transition-all active:scale-[0.985]"
          >
            <Plus size={20} />
            New Conversation
          </button>
        </div>

        {/* Skills Navigation 
        <div className="px-4 mb-2">
          <div className="uppercase text-xs font-semibold tracking-widest text-slate-500 px-4 mb-2">8 Empathy Skills</div>
          <div className="space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto pr-2 custom-scrollbar">
            {EIGHT_SKILLS.map((skill) => (
              <button
                key={skill.id}
                onClick={() => handleSkillSelect(skill)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all hover:bg-slate-100 group ${selectedSkill.id === skill.id ? 'bg-teal-50 border border-teal-200' : ''}`}
              >
                <span className="text-2xl">{skill.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-700 line-clamp-2">{skill.name}</p>
                </div>
                {selectedSkill.id === skill.id && (
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Access 
        <div className="mt-auto border-t p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('activities')}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-2xl transition-colors"
          >
            <PlayCircle size={20} />
            <span className="font-medium">Activities & Videos</span>
          </button>
          
          <button 
            onClick={() => window.location.href = '/quiz'}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-2xl transition-colors"
          >
            <Award size={20} />
            <span className="font-medium">Take Quiz</span>
          </button>

          <button 
            onClick={() => window.location.href = '/progress'}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-2xl transition-colors"
          >
            <TrendingUp size={20} />
            <span className="font-medium">My Progress</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area 
      <div className="flex-1 flex flex-col h-full">
        {/* Top Header 
        <div className="h-14 border-b bg-white px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-slate-600"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedSkill.icon}</span>
              <div>
                <h2 className="font-semibold text-slate-800">{selectedSkill.name}</h2>
                <p className="text-xs text-emerald-600">SEEK • Level {Math.floor(Math.random()*3) + 1}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="hidden sm:flex items-center bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
              ❤️ Empathy Score: 78%
            </div>
            <button className="text-slate-500 hover:text-slate-700 transition-colors">
              <BookOpen size={20} />
            </button>
          </div>
        </div>

        {/* Messages Area 
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-8 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[40px_40px]"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="text-7xl mb-6 opacity-75">{selectedSkill.icon}</div>
              <h3 className="text-2xl font-semibold text-slate-700 mb-2">Welcome to {selectedSkill.name}</h3>
              <p className="text-slate-600 leading-relaxed">
                I'm here to help you develop deeper emotional intelligence. 
                Ask me anything about this skill or share how you're feeling today.
              </p>
              
              <div className="mt-10 grid grid-cols-2 gap-3 w-full max-w-sm">
                {["What is self-compassion?", "How do I practice mindfulness?", "Give me an activity"].map((q, i) => (
                  <button 
                    key={i}
                    onClick={() => setInput(q)}
                    className="text-left p-4 bg-white border border-slate-200 hover:border-teal-300 rounded-3xl text-sm transition-all hover:shadow"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))
          )}
        </div>

        {/* Input Area 
        <div className="border-t bg-white p-6">
          <ChatInput 
            input={input}
            setInput={setInput}
            onSend={handleSend}
            disabled={!input.trim()}
          />
          
          <div className="flex justify-center gap-6 mt-4 text-xs text-slate-500">
            <button 
              onClick={() => startActivity('video')}
              className="flex items-center gap-1.5 hover:text-teal-600 transition-colors"
            >
              <PlayCircle size={16} /> Video Lesson
            </button>
            <button 
              onClick={() => startActivity('activity')}
              className="flex items-center gap-1.5 hover:text-teal-600 transition-colors"
            >
              <BookOpen size={16} /> Guided Activity
            </button>
            <button 
              onClick={() => startActivity('quiz')}
              className="flex items-center gap-1.5 hover:text-teal-600 transition-colors"
            >
              <Award size={16} /> Quick Check-in
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Context Helper (Optional but useful) 
      <div className="hidden xl:block w-80 border-l bg-white p-6 overflow-y-auto">
        <div className="sticky top-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-slate-700">
            <span>📖</span> Today's Focus
          </h3>
          
          <div className="bg-teal-50 border border-teal-100 rounded-3xl p-5 mb-6">
            <p className="text-sm leading-relaxed text-slate-600">
              {selectedSkill.name} helps us respond to ourselves and others with kindness and understanding. 
              Today we are focusing on practical exercises.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-500 mb-3">RECOMMENDED NEXT</h4>
              <div className="space-y-3">
                {["Guided Breathing Exercise", "Gratitude Journal Prompt", "Empathy Mapping Activity"].map((item, i) => (
                  <div key={i} className="bg-white border rounded-2xl p-4 text-sm cursor-pointer hover:border-teal-300 transition-colors" onClick={() => startActivity(item)}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;*/