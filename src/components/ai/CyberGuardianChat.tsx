import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, Shield, AlertCircle, HelpCircle } from 'lucide-react';

interface CyberGuardianChatProps {
  isOpen: boolean;
  onClose: () => void;
  activeContext?: any;
}

interface Message {
  role: 'assistant' | 'user';
  text: string;
  timestamp: string;
}

export const CyberGuardianChat: React.FC<CyberGuardianChatProps> = ({
  isOpen,
  onClose,
  activeContext
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "Greetings. I am Threatora's Cyber Guardian. Ask me anything about suspicious links, TLS certificates, typosquatting lookalike domains, or how to stay safe from online deception.",
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    'Is HTTPS enough to know a website is legitimate?',
    'What is typosquatting?',
    'What should I do if I entered credentials on a phishing page?',
    'How does Certificate Transparency prevent attacks?'
  ];

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || loading) return;

    const userMsg: Message = {
      role: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/ask-guardian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, context: activeContext })
      });
      const data = await res.json();
      const botMsg: Message = {
        role: 'assistant',
        text: data.answer || 'I could not process that inquiry. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'Security network connection error. Please verify your connection.',
          timestamp: 'Now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#0D1220] border-l border-[#273449] shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#273449] flex items-center justify-between bg-[#111827]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/40 flex items-center justify-center">
            <Bot className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Threatora Cyber Guardian
              <Sparkles className="w-3 h-3 text-violet-400" />
            </h3>
            <span className="text-[11px] text-slate-400">Security Intelligence Assistant</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#172033] transition-colors"
          aria-label="Close Cyber Guardian"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-violet-600 text-white rounded-br-sm'
                  : 'bg-[#172033] border border-[#273449] text-slate-200 rounded-bl-sm'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Consulting threat intelligence model...</span>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      <div className="p-3 border-t border-[#273449] bg-[#080B14]/60 space-y-1.5">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
          Quick Inquiries
        </span>
        <div className="flex flex-wrap gap-1.5">
          {sampleQuestions.slice(0, 2).map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSend(sq)}
              className="text-[11px] text-slate-300 bg-[#111827] border border-[#273449] hover:border-violet-500/50 hover:text-white px-2.5 py-1 rounded-md text-left transition-colors truncate max-w-full"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[#273449] bg-[#111827]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about threats, TLS, scams..."
            className="flex-1 bg-[#080B14] border border-[#273449] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            aria-label="Send query"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
