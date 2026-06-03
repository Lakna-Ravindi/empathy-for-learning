import axiosInstance from "../utils/axiosInstance";

export async function sendMessage(message, history = []) {
  const payload = {
    message,
    history: history.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  };
 
  const { data } = await axiosInstance.post("/chat/message", payload);
  return data; // Expected: { message: string, emotion: string }
}
 
/**
 * Fetch chat history for the current user
 */
export async function getChatHistory() {
  const { data } = await axiosInstance.get("/chat/history");
  return data;
}
 
/**
 * Clear chat history
 */
export async function clearChatHistory() {
  const { data } = await axiosInstance.delete("/chat/history");
  return data;
}