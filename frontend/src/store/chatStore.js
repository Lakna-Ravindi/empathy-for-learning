import { create } from 'zustand';

export const useChatStore = create((set) => ({
  messages: [],
  currentSkill: null,

  addMessage: (message) => 
    set((state) => ({ messages: [...state.messages, message] })),

  clearChat: () => set({ messages: [] }),

  setCurrentSkill: (skill) => set({ currentSkill: skill }),
}));