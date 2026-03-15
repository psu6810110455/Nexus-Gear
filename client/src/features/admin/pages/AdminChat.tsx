import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, User as UserIcon, MessageSquare, Search } from 'lucide-react';
import AdminLayout from '../../navigation/components/AdminLayout';
import { useAuth } from '../../auth/context/AuthContext';

interface ChatMessage {
  id: number;
  userId: number;
  sender: 'user' | 'admin';
  message: string;
  isRead: boolean;
  createdAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
    picture?: string;
  };
}

interface ChatSession {
  userId: number;
  userName: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

const AdminChat: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Record<number, ChatSession>>({});
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = io('http://localhost:3000');
    socketRef.current = socket;

    // Listen for new messages from anyone
    socket.on('adminNewMessage', (msg: ChatMessage) => {
      setSessions(prev => {
        const userId = msg.userId;
        const currentSession = prev[userId] || {
          userId,
          userName: msg.user?.name || `User #${userId}`,
          lastMessage: '',
          lastTime: '',
          unreadCount: 0,
          messages: [],
        };

        const updatedMessages = [...currentSession.messages, msg];
        
        return {
          ...prev,
          [userId]: {
            ...currentSession,
            lastMessage: msg.message,
            lastTime: msg.createdAt,
            unreadCount: (selectedUserId !== userId && msg.sender === 'user') 
              ? currentSession.unreadCount + 1 
              : currentSession.unreadCount,
            messages: updatedMessages,
          }
        };
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedUserId]);

  useEffect(() => {
    if (selectedUserId) {
      // When selecting a user, join their room to see history or focus
      socketRef.current?.emit('join', { userId: selectedUserId });
      
      // Also fetch history specifically
      socketRef.current?.on('messageHistory', (history: ChatMessage[]) => {
        setSessions(prev => ({
          ...prev,
          [selectedUserId]: {
            ...prev[selectedUserId],
            messages: history,
            unreadCount: 0,
          }
        }));
      });
    }
  }, [selectedUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedUserId, sessions[selectedUserId || -1]?.messages.length]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedUserId) return;

    socketRef.current?.emit('sendMessage', {
      userId: selectedUserId,
      sender: 'admin',
      message: inputValue.trim(),
    });

    setInputValue('');
  };

  const activeSessions = Object.values(sessions).sort((a, b) => 
    new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime()
  ).filter(s => s.userName.toLowerCase().includes(searchTerm.toLowerCase()));

  const selectedSession = selectedUserId ? sessions[selectedUserId] : null;

  return (
    <AdminLayout breadcrumb="แชทกับลูกค้า">
      <div className="h-[calc(100vh-180px)] bg-[#0a0a0a] border border-[#990000]/30 rounded-3xl overflow-hidden flex font-['Kanit']">
        
        {/* Sidebar: Session List */}
        <div className="w-80 border-r border-[#990000]/20 flex flex-col bg-[#000000]/40">
          <div className="p-4 border-b border-[#990000]/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="ค้นหาชื่อลูกค้า..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black border border-[#990000]/20 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-red-600 transition"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {activeSessions.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">ยังไม่มีรายการแชท</div>
            ) : (
              activeSessions.map(session => (
                <button 
                  key={session.userId} 
                  onClick={() => setSelectedUserId(session.userId)}
                  className={`w-full p-4 flex gap-3 border-b border-[#990000]/10 hover:bg-[#2E0505]/20 transition text-left ${
                    selectedUserId === session.userId ? 'bg-[#2E0505]/40 border-l-4 border-l-red-600' : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-red-600/10 flex items-center justify-center border border-red-600/30 shrink-0">
                    <UserIcon size={20} className="text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h5 className="text-white font-bold text-sm truncate">{session.userName}</h5>
                      <span className="text-[10px] text-gray-500 shrink-0">
                        {session.lastTime ? new Date(session.lastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-1">{session.lastMessage}</p>
                  </div>
                  {session.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                      {session.unreadCount}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-black/20">
          {selectedUserId && selectedSession ? (
            <>
              {/* Header */}
              <div className="p-4 bg-[#18181b]/50 border-b border-[#990000]/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center border border-red-600/30">
                  <UserIcon size={20} className="text-red-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{selectedSession.userName}</h4>
                  <p className="text-[10px] text-gray-500">User ID: #{selectedUserId}</p>
                </div>
              </div>

              {/* Messages */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4"
              >
                {selectedSession.messages.map((msg, i) => (
                  <div key={msg.id || i} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                      msg.sender === 'admin' 
                        ? 'bg-red-600 text-white rounded-tr-none' 
                        : 'bg-[#18181b] text-white border border-[#990000]/20 rounded-tl-none'
                    }`}>
                      {msg.message}
                      <div className={`text-[10px] mt-1 opacity-60 ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-[#990000]/20 bg-[#18181b]/30 flex gap-3">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="พิมพ์ข้อความตอบกลับ..."
                  className="flex-1 bg-black border border-[#990000]/30 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-600 transition"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 disabled:opacity-50"
                >
                  <Send size={18} /> ส่ง
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-50">
              <MessageSquare size={64} className="mb-4" />
              <p>เลือกรายการแชทเพื่อเริ่มต้นสนทนา</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminChat;
