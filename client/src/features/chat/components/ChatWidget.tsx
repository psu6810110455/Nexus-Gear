import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessageSquare, Send, X, Cloud, MessageCircle } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';

interface ChatMessage {
  id: number;
  userId: number;
  sender: 'user' | 'admin';
  message: string;
  isRead: boolean;
  createdAt: string;
}

const ChatWidget: React.FC = () => {
  const { user, isLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoggedIn && user) {
      // Connect to socket
      const socket = io('http://localhost:3000');
      socketRef.current = socket;

      socket.emit('join', { userId: user.id });

      socket.on('messageHistory', (history: ChatMessage[]) => {
        setMessages(history);
        const unread = history.filter(m => !m.isRead && m.sender === 'admin').length;
        setUnreadCount(unread);
      });

      socket.on('newMessage', (msg: ChatMessage) => {
        setMessages(prev => [...prev, msg]);
        if (!isOpen && msg.sender === 'admin') {
          setUnreadCount(prev => prev + 1);
        }
      });

      socket.on('unreadUpdated', (data: { count: number }) => {
        setUnreadCount(data.count);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    if (isOpen && unreadCount > 0 && user) {
      socketRef.current?.emit('markAsRead', { userId: user.id });
      setUnreadCount(0);
    }
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages.length]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !user) return;

    socketRef.current?.emit('sendMessage', {
      userId: user.id,
      sender: 'user',
      message: inputValue.trim(),
    });

    setInputValue('');
  };

  if (!isLoggedIn) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-['Kanit']">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-[#0f0f12] border border-[#ff0000]/20 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-[#18181b] p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center border border-red-600/30">
                <MessageCircle size={20} className="text-red-500" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm leading-none">แอดมิน Nexus Gear</h4>
                <p className="text-[10px] text-green-500 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> ออนไลน์
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-red-600/20"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <Cloud size={48} className="mb-2" />
                <p className="text-sm">ยินดีต้อนรับสู่ Nexus Gear Chat<br/>สอบถามแอดมินได้เลยครับ!</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={msg.id || i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-red-600 text-white rounded-tr-none shadow-[0_2px_10px_rgba(220,38,38,0.2)]' 
                      : 'bg-[#18181b] text-white border border-white/10 rounded-tl-none'
                  }`}>
                    {msg.message}
                    <div className={`text-[10px] mt-1 opacity-60 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <form onSubmit={handleSendMessage} className="p-4 bg-[#18181b] border-t border-white/5 flex gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="พิมพ์ข้อความ..."
              className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-red-600/50 transition"
            />
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="w-10 h-10 bg-red-600 text-white rounded-lg flex items-center justify-center hover:bg-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button (Cloud Icon) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-[#18181b] text-white border border-white/10' : 'bg-red-600 text-white'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        
        {unreadCount > 0 && !isOpen && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-white text-red-600 text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-red-600 shadow-lg">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
