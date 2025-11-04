import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Loader, Minus } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  loading?: boolean;
}

interface ChatbotProps {
  onDataUpdate?: (data: any) => void;
}

const WEBHOOK_URL = 'https://shazliaslam.app.n8n.cloud/webhook/sheetacess';

export default function Chatbot({ onDataUpdate }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I can help you query and manage your Google Sheets data. Try asking me questions about your clients, revenue, or headshot orders.',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage.text,
          timestamp: userMessage.timestamp.toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Webhook error: ${response.status}`);
      }

      const data = await response.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: extractOutputText(data),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      if (onDataUpdate) {
        onDataUpdate(data);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: `Error: ${error instanceof Error ? error.message : 'Failed to communicate with the server'}`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const extractOutputText = (data: any): string => {
    if (typeof data === 'string') {
      return data;
    }

    try {
      if (typeof data === 'object' && data !== null && 'output' in data) {
        return data.output;
      }
      return JSON.stringify(data, null, 2);
    } catch {
      return JSON.stringify(data, null, 2);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <div
        className={`w-96 flex flex-col rounded-2xl border border-cyan-500/30 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-cyan-500/20 overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? 'h-[600px] opacity-100 translate-y-0' : 'h-0 opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />

        <div className="relative z-10 flex-1 flex flex-col">
          <div className="bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border-b border-cyan-500/20 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <MessageCircle className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Data Assistant</h3>
                <p className="text-xs text-slate-400">Connected to n8n Webhook</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors duration-200"
              aria-label="Minimize chat"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-900/50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-xl backdrop-blur-sm transition-all duration-300 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-br-none'
                    : 'bg-slate-800/60 border border-slate-700/50 text-slate-100 rounded-bl-none'
                }`}
              >
                <p className="text-sm leading-relaxed break-words">{message.text}</p>
                <span
                  className={`text-xs mt-2 block ${
                    message.sender === 'user' ? 'text-cyan-100' : 'text-slate-400'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl rounded-bl-none px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Loader className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span className="text-sm text-slate-400">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="border-t border-slate-700/50 p-4 bg-slate-900/50">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 bg-slate-800/50 border border-slate-700/50 text-white text-sm px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-500/50 disabled:opacity-50 transition-colors placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white p-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-500/50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
        </div>
      </div>

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-2xl border border-cyan-500/30 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-cyan-500/20 p-3 flex items-center justify-center hover:shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-110 flex-shrink-0"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6 text-cyan-400" />
        </button>
      )}
    </div>
  );
}
