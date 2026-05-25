import { Send } from 'lucide-react';

const ChatInput = ({ input, setInput, onSend }) => {
  return (
    <div className="relative">
      <div className="flex bg-white border border-slate-300 focus-within:border-teal-400 rounded-3xl shadow-sm transition-all overflow-hidden">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          placeholder="Ask anything about this skill... (Try in Sinhala or Tamil too!)"
          className="flex-1 bg-transparent px-6 py-4 outline-none text-slate-700 placeholder:text-slate-400"
        />
        <button
          onClick={onSend}
          disabled={!input.trim()}
          className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white p-4 rounded-r-3xl transition-all mr-1.5 my-1"
        >
          <Send size={22} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;