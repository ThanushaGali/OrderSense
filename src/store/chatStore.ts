import { create } from "zustand";
import type { Restaurant } from "@/data/restaurants";
import { generateAIReply } from "@/services/aiEngine";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  recommendations?: Restaurant[];
}

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  recommendations: Restaurant[];
  sendMessage: (text: string) => Promise<void>;
  reset: () => void;
}

const greeting: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hey 👋 I'm OrderSense. Tell me what you're craving or name a restaurant — I'll predict the wait and find you a faster option if it's slammed.",
  timestamp: Date.now(),
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [greeting],
  isTyping: false,
  recommendations: [],

  sendMessage: async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };
    set({ messages: [...get().messages, userMsg], isTyping: true });

    try {
      // Simulate thinking time
      await new Promise((r) => setTimeout(r, 1000 + Math.random() * 800));

      const reply = generateAIReply(trimmed);
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: reply.text,
        timestamp: Date.now(),
        recommendations: reply.recommendations,
      };
      set({
        messages: [...get().messages, aiMsg],
        isTyping: false,
        recommendations: reply.recommendations,
      });
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Unable to fetch data. Please try again.",
        timestamp: Date.now(),
      };
      set({ messages: [...get().messages, errorMsg], isTyping: false });
    }
  },

  reset: () => set({ messages: [greeting], recommendations: [], isTyping: false }),
}));
