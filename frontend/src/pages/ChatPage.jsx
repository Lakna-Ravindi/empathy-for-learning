import { useState, useCallback } from "react";
import ChatWindow from "../components/chat/ChatWindow";
import ChatInput from "../components/chat/ChatInput";
import useAuthStore from "../store/authStore";
import useChatStore from "../store/chatStore";
import { sendMessage } from "../api/chatApi";
import { Brain, TrendingUp, ShieldCheck, Smile } from "lucide-react";
 
// Emotion level badge colors
const emotionLevelStyle = {
  Low: "text-green-600 bg-green-50",
  Moderate: "text-yellow-600 bg-yellow-50",
  High: "text-red-600 bg-red-50",
};
 
const riskLevelStyle = {
  LOW: "text-green-600",
  MEDIUM: "text-yellow-600",
  HIGH: "text-red-600",
};
 
export default function ChatPage() {
  const user = useAuthStore((state) => state.user);
  const { messages, addMessage, isLoading, setLoading } = useChatStore();
 
  // Fallback demo stats (replace with real data from API)
  const stats = {
    emotionalLevel: user?.emotionalLevel || "Moderate",
    skillsProgress: user?.skillsProgress || "2/8",
    riskLevel: user?.riskLevel || "LOW",
    currentEmotion: user?.currentEmotion || "Calm",
  };
 
  const handleSend = useCallback(
    async (text) => {
      const now = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
 
      // Add user message
      addMessage({
        id: Date.now(),
        role: "user",
        content: text,
        timestamp: now,
        emotion: "moderate",
      });
 
      setLoading(true);
 
      try {
        const response = await sendMessage(text, messages);
        addMessage({
          id: Date.now() + 1,
          role: "assistant",
          content: response.message || response,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          emotion: response.emotion || "calm",
        });
      } catch (err) {
        addMessage({
          id: Date.now() + 1,
          role: "assistant",
          content:
            "I'm here to listen. It seems there was a connection issue — please try again.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          emotion: "calm",
        });
      } finally {
        setLoading(false);
      }
    },
    [messages, addMessage, setLoading]
  );
 
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Welcome */}
          <div>
            <p className="text-xs text-gray-600 mb-0.5">Welcome,</p>
            <p className="font-bold text-gray-800 text-lg leading-tight">
              {user?.username}
            </p>
          </div>
 
          {/* Stats cards */}
          <div className="flex gap-3 flex-wrap">
            <StatCard
              icon={<Brain size={14} className="text-yellow-500" />}
              label="Emotional Level"
              value={stats.emotionalLevel}
              valueClass={
                emotionLevelStyle[stats.emotionalLevel] ||
                "text-yellow-600 bg-yellow-50"
              }
            />
            <StatCard
              icon={<TrendingUp size={14} className="text-blue-500" />}
              label="Skills Progress"
              value={stats.skillsProgress}
              valueClass="text-blue-600 bg-blue-50"
            />
            <StatCard
              icon={<ShieldCheck size={14} className="text-green-500" />}
              label="Risk Level"
              value={stats.riskLevel}
              valueClass={
                riskLevelStyle[stats.riskLevel] || "text-green-600"
              }
              plain
            />
            <StatCard
              icon={<Smile size={14} className="text-indigo-500" />}
              label="Current Emotion"
              value={stats.currentEmotion}
              valueClass="text-indigo-600 bg-indigo-50"
            />
          </div>
        </div>
      </div>
 
      {/* Chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat header */}
        <div className="px-6 pt-5 pb-2 flex-shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">💬</span>
            <h1 className="text-xl font-bold text-gray-800">
              SEEK Empathy Guide Chatbot
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Emotion-aware support guided by SEEK principles:{" "}
            <span className="font-medium text-indigo-600">
              Self-awareness, Empathy, Ethics, and Kindness.
            </span>
          </p>
        </div>
 
        {/* Message container with card */}
        <div className="flex-1 mx-5 mb-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <ChatWindow messages={messages} isLoading={isLoading} />
        </div>
 
        {/* Input */}
        <div className="flex-shrink-0">
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
 
function StatCard({ icon, label, value, valueClass, plain }) {
  return (
    <div className="border border-gray-100 rounded-xl px-4 py-2.5 bg-white shadow-sm min-w-[110px]">
      <div className="flex items-center gap-1 mb-1">
        {icon}
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
          {label}
        </p>
      </div>
      <p
        className={`text-base font-bold ${
          plain
            ? valueClass
            : `px-2 py-0.5 rounded-lg inline-block text-sm ${valueClass}`
        }`}
      >
        {value}
      </p>
    </div>
  );
}