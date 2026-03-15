import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessageSquare, Send, X, Cloud, MessageCircle, Clock } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

interface ChatMessage {
  id: number;
  userId: number;
  sender: 'user' | 'admin';
  message: string;
  isRead: boolean;
  metadata?: {
    productId?: number;
    productName?: string;
    productImage?: string;
  };
  createdAt: string;
}

const ChatWidget: React.FC = () => {
  const { user, isLoggedIn } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const navigate = useNavigate();
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoggedIn && user) {
      const socket = io('http://localhost:3000');
      socketRef.current = socket;

      socket.emit('join', { userId: user.id });

      socket.on('messageHistory', (history: ChatMessage[]) => {
        setMessages(history);
        const unread = history.filter(m => !m.isRead && m.sender === 'admin').length;
        setUnreadCount(unread);
      });

      socket.on('newMessage', (msg: ChatMessage) => {
        setMessages(prev => {
          // Replace optimistic message if exists
          const optimisticIndex = prev.findIndex(m => !m.id && m.message === msg.message && m.sender === msg.sender);
          if (optimisticIndex > -1) {
            const next = [...prev];
            next[optimisticIndex] = msg;
            return next;
          }
          // Avoid duplicates
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        if (!isOpen && msg.sender === 'admin') {
          setUnreadCount(prev => prev + 1);
        }
      });

      socket.on('unreadUpdated', (data: { count: number }) => {
        setUnreadCount(data.count);
      });

      // Special for admin: listen to all new messages from users
      if (user.role === 'admin') {
        socket.on('adminNewMessage', (msg: ChatMessage) => {
          if (msg.sender === 'user' && !location.pathname.startsWith('/admin/chat')) {
            setUnreadCount(prev => prev + 1);
            // Play notification sound for admin
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
            audio.play().catch(() => {});
          }
        });
      }

      socket.on('typing', (data: { isTyping: boolean }) => {
        setIsAdminTyping(data.isTyping);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [isLoggedIn, user, isOpen]);

  useEffect(() => {
    if (isOpen && unreadCount > 0 && user && user.role !== 'admin') {
      socketRef.current?.emit('markAsRead', { userId: user.id });
      setUnreadCount(0);
    }
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages.length, isAdminTyping]);

  const toggleOpen = () => {
    if (user?.role === 'admin') {
      navigate('/admin/chat');
      setUnreadCount(0);
      return;
    }
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    
    // Send typing status
    if (user) {
      socketRef.current?.emit('typing', { userId: user.id, sender: 'user', isTyping: true });
      
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit('typing', { userId: user.id, sender: 'user', isTyping: false });
      }, 3000);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !user) return;

    // Check if on product page to add metadata
    let metadata = undefined;
    if (location.pathname.startsWith('/products/')) {
      const productId = parseInt(location.pathname.split('/').pop() || '0');
      metadata = { productId };
    }

    // Optimistic Update
    const optimisticMsg: ChatMessage = {
      id: 0,
      userId: user.id,
      sender: 'user',
      message: inputValue.trim(),
      isRead: true,
      createdAt: new Date().toISOString(),
      metadata
    };
    setMessages(prev => [...prev, optimisticMsg]);

    socketRef.current?.emit('sendMessage', {
      userId: user.id,
      sender: 'user',
      message: inputValue.trim(),
      metadata
    });

    setInputValue('');
    socketRef.current?.emit('typing', { userId: user.id, sender: 'user', isTyping: false });
  };

  if (!isLoggedIn || location.pathname === '/admin/chat') return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-['Kanit']">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] h-[550px] bg-[#0f0f12] border border-[#ff0000]/20 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-[#18181b] p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center border border-red-600/30 shadow-[0_0_10px_rgba(220,38,38,0.2)]">
                <MessageCircle size={20} className="text-red-500" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm leading-none">แอดมิน Nexus Gear</h4>
                <p className="text-[10px] text-green-500 mt-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></span> 
                  ออนไลน์
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-white/5 hover:text-white transition">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] scrollbar-none"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                <Cloud size={48} className="mb-3 text-red-600" />
                <p className="text-sm font-medium">ยินดีต้อนรับสู่ Nexus Gear Chat<br/><span className="text-xs">สอบถามข้อมูลสินค้าและบริการได้ตลอด 24 ชม.</span></p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={msg.id || i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3.5 px-4 rounded-2xl text-[13px] leading-relaxed shadow-lg ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-red-600 to-red-700 text-white rounded-tr-none' 
                      : 'bg-[#18181b] text-white border border-white/10 rounded-tl-none'
                  }`}>
                    {msg.message}
                    <div className={`text-[9px] mt-1.5 opacity-60 flex items-center gap-1 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <Clock size={10} />
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {isAdminTyping && (
              <div className="flex justify-start">
                <div className="bg-[#18181b]/50 text-red-500 text-[10px] px-3 py-1.5 rounded-full border border-red-500/20 italic animate-pulse">
                  แอดมิน กำลังพิมพ์...
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <form onSubmit={handleSendMessage} className="p-4 bg-[#18181b] border-t border-white/5 flex gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={handleInputChange}
              placeholder="พิมพ์ข้อความของคุณ..."
              className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-[13px] focus:outline-none focus:border-red-600 transition placeholder:text-gray-600"
            />
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="w-11 h-11 bg-red-600 text-white rounded-xl flex items-center justify-center hover:bg-red-500 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(220,38,38,0.3)]"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button (Cloud Icon) */}
      <button 
        onClick={toggleOpen}
        className={`group relative w-16 h-16 rounded-full flex items-center justify-center shadow-[0_5px_25px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-105 active:scale-90 ${
          isOpen ? 'bg-[#18181b] text-white border border-white/10' : 'bg-gradient-to-tr from-red-700 to-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]'
        }`}
      >
        {isOpen ? <X size={28} /> : (user?.role === 'admin' ? <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" /> : <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />)}
        
        {unreadCount > 0 && (!isOpen || user?.role === 'admin') && (
          <div className="absolute -top-1 -right-1 w-7 h-7 bg-white text-red-600 text-[11px] font-black rounded-full flex items-center justify-center border-2 border-red-600 shadow-xl animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
