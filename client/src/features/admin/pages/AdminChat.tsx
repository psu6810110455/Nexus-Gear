import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '../../../shared/services/socket';
import { Send, User as UserIcon, MessageSquare, Search, Info, Package, Smile, Clock } from 'lucide-react';
import AdminLayout from '../../navigation/components/AdminLayout';
import { useAuth } from '../../auth/context/AuthContext';

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
  userPicture?: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  messages: ChatMessage[];
  isTyping: boolean;
}

const QUICK_RESPONSES = [
  "สวัสดีครับ Nexus Gear ยินดีให้บริการครับ มีอะไรให้ช่วยไหมครับ?",
  "ขอบคุณที่สนใจสินค้าของเราครับ รายการนี้พร้อมส่งครับ",
  "ขออภัยในความความล่าช้าครับ ทางเรากำลังตรวจสอบข้อมูลให้ครับ",
  "แจ้งเลขพัสดุเรียบร้อยครับ สามารถตรวจสอบได้ในระบบเลยครับ",
  "หากได้รับสินค้าแล้วรบกวนรีวิวให้คะแนนด้วยนะครับ ขอบคุณครับ"
];

const AdminChat: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Record<number, ChatSession>>({});
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const selectedUserIdRef = useRef<number | null>(null);

  useEffect(() => {
    selectedUserIdRef.current = selectedUserId;
    if (selectedUserId) {
      setSessions(prev => {
        if (!prev[selectedUserId]) return prev;
        return {
          ...prev,
          [selectedUserId]: {
            ...prev[selectedUserId],
            unreadCount: 0
          }
        };
      });
    }
  }, [selectedUserId]);

  const addMessagesToSession = (userId: number, msgOrHistory: ChatMessage | ChatMessage[]) => {
    setSessions(prev => {
      const current = prev[userId] || {
        userId,
        userName: `User #${userId}`,
        lastMessage: '',
        lastTime: new Date().toISOString(),
        unreadCount: 0,
        messages: [],
        isTyping: false
      };

      const incoming = Array.isArray(msgOrHistory) ? msgOrHistory : [msgOrHistory];
      const firstWithUser = incoming.find(m => m.user);
      
      let newMessages = [...current.messages];

      incoming.forEach(msg => {
        const optIndex = newMessages.findIndex(m => !m.id && m.message === msg.message && m.sender === msg.sender);
        if (optIndex > -1) {
          newMessages[optIndex] = msg;
        } else {
          if (msg.id && newMessages.some(m => m.id === msg.id)) return;
          newMessages.push(msg);
        }
      });

      newMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      const lastMsg = newMessages[newMessages.length - 1];
      const isCurrentlySelected = selectedUserIdRef.current === userId;

      return {
        ...prev,
        [userId]: {
          ...current,
          userName: firstWithUser?.user?.name || current.userName,
          userPicture: firstWithUser?.user?.picture || current.userPicture,
          lastMessage: lastMsg?.message || current.lastMessage,
          lastTime: lastMsg?.createdAt || current.lastTime,
          messages: newMessages,
          unreadCount: (!isCurrentlySelected && incoming.some(m => m.sender === 'user')) 
            ? (current.unreadCount + 1)
            : (isCurrentlySelected ? 0 : current.unreadCount)
        }
      };
    });
  };

  useEffect(() => {
    // Initialize socket once
    const socket = getSocket();
    socketRef.current = socket;

    socket.on('adminNewMessage', (msg: ChatMessage) => {
      if (msg.sender === 'user') {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
        audio.play().catch(() => {});
      }
      addMessagesToSession(msg.userId, msg);
    });

    socket.on('newMessage', (msg: ChatMessage) => {
       // Just in case we receive it via room broadcast too
       addMessagesToSession(msg.userId, msg);
    });

    socket.on('adminTyping', (data: { userId: number; isTyping: boolean }) => {
      setSessions(prev => {
        if (!prev[data.userId]) return prev;
        return {
          ...prev,
          [data.userId]: {
            ...prev[data.userId],
            isTyping: data.isTyping
          }
        };
      });
    });

    socket.on('messageHistory', (history: ChatMessage[]) => {
      if (history.length > 0) {
        addMessagesToSession(history[0].userId, history);
      } else if (selectedUserIdRef.current) {
        // Ensure session exists if history is empty
        addMessagesToSession(selectedUserIdRef.current, []);
      }
    });

    socket.on('adminSessionsHistory', (initialMessages: ChatMessage[]) => {
      initialMessages.forEach(msg => {
        setSessions(prev => {
          if (prev[msg.userId]) return prev;
          return {
            ...prev,
            [msg.userId]: {
              userId: msg.userId,
              userName: msg.user?.name || `User #${msg.userId}`,
              userPicture: msg.user?.picture,
              lastMessage: msg.message,
              lastTime: msg.createdAt,
              unreadCount: 0, // Simplified for now
              messages: [msg],
              isTyping: false
            }
          };
        });
      });
    });

    // Ask for all sessions on load
    socket.emit('adminGetAllSessions');

    return () => {
      socket.disconnect();
    };
  }, []); // Only once

  // Separate effect for joining rooms when selectedUserId changes
  useEffect(() => {
    if (selectedUserId && socketRef.current) {
      // Ensure session exists immediately
      setSessions(prev => {
        if (prev[selectedUserId]) return prev;
        return {
          ...prev,
          [selectedUserId]: {
            userId: selectedUserId,
            userName: `User #${selectedUserId}`,
            lastMessage: '',
            lastTime: new Date().toISOString(),
            unreadCount: 0,
            messages: [],
            isTyping: false
          }
        };
      });
      socketRef.current.emit('join', { userId: selectedUserId });
    }
  }, [selectedUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedUserId, sessions[selectedUserId || -1]?.messages.length, sessions[selectedUserId || -1]?.isTyping]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    
    // Typing status
    if (selectedUserId) {
      socketRef.current?.emit('typing', { userId: selectedUserId, sender: 'admin', isTyping: true });
      
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit('typing', { userId: selectedUserId, sender: 'admin', isTyping: false });
      }, 3000);
    }
  };

  const handleSendMessage = (e?: React.FormEvent, text?: string) => {
    e?.preventDefault();
    const messageToSend = text || inputValue;
    if (!messageToSend.trim() || !selectedUserId) return;

    // Optimistic Update
    const optimisticMsg: ChatMessage = {
      id: 0, // Temp ID
      userId: selectedUserId,
      sender: 'admin',
      message: messageToSend.trim(),
      isRead: true,
      createdAt: new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' }).replace(' ', 'T') + '+07:00',
    };

    addMessagesToSession(selectedUserId, optimisticMsg);

    socketRef.current?.emit('sendMessage', {
      userId: selectedUserId,
      sender: 'admin',
      message: messageToSend.trim(),
    });

    if (!text) setInputValue('');
    socketRef.current?.emit('typing', { userId: selectedUserId, sender: 'admin', isTyping: false });
  };

  const activeSessions = Object.values(sessions)
    .sort((a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime())
    .filter(s => {
      const lowerSearch = searchTerm.toLowerCase().trim();
      const isSearchMatched = 
        s.userName.toLowerCase().includes(lowerSearch) || 
        s.userId.toString() === lowerSearch;
        
      if (!isSearchMatched) return false;

      // Filter by 7 days (7 * 24 * 60 * 60 * 1000 ms)
      const lastTimeMs = new Date(s.lastTime).getTime();
      const nowMs = new Date().getTime();
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      
      // If unreadCount > 0, always show (wake up)
      if (s.unreadCount > 0) return true;
      
      // Filter out self-chat
      if (user && s.userId === user.id) return false;
      
      return (nowMs - lastTimeMs) < sevenDaysMs;
    });

  const formatTime = (dateStr: any) => {
    if (!dateStr) return '';
    try {
      let str = String(dateStr).trim().replace(/\//g, '-');
      if (!str.includes('T') && str.includes(' ')) str = str.replace(' ', 'T');
      
      const d = new Date(str);
      if (isNaN(d.getTime())) return String(dateStr);

      return new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Bangkok',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }).format(d);
    } catch {
      return String(dateStr);
    }
  };

  const selectedSession = selectedUserId ? sessions[selectedUserId] : null;

  const getLastMessagePreview = (session: ChatSession) => {
    if (session.isTyping) return 'กำลังพิมพ์...';
    if (!session.lastMessage) return 'ยังไม่มีข้อความ';
    
    // Check if the last message was sent by admin
    const lastMsg = session.messages.length > 0 ? session.messages[session.messages.length - 1] : null;
    const prefix = lastMsg?.sender === 'admin' ? 'คุณ: ' : '';
    return `${prefix}${session.lastMessage}`;
  };

  return (
    <AdminLayout breadcrumb="แชทกับลูกค้า">
      <div className="flex flex-col h-full bg-[#0a0a0a] border border-[#990000]/30 rounded-3xl overflow-hidden font-['Kanit']">
        
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar: Session List */}
        <div className="w-64 border-r border-[#990000]/20 flex flex-col bg-[#000000]/40 shrink-0">
          <div className="p-4 border-b border-[#990000]/20">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <MessageSquare size={18} className="text-red-600" /> ห้องแชททั้งหมด
            </h3>
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
                  className={`w-full p-4 flex gap-3 border-b border-[#990000]/10 hover:bg-[#2E0505]/20 transition text-left relative ${
                    selectedUserId === session.userId ? 'bg-[#2E0505]/40 border-l-4 border-l-red-600' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border border-[#990000]/30 overflow-hidden bg-red-600/10 flex items-center justify-center shrink-0">
                      {session.userPicture ? (
                        <img src={session.userPicture} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon size={20} className="text-red-500" />
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h5 className="text-white font-bold text-sm truncate">{session.userName}</h5>
                      <span className="text-[10px] text-gray-500 shrink-0">
                        {session.lastTime ? formatTime(session.lastTime) : ''}
                      </span>
                    </div>
                    <p className={`text-xs truncate mt-1 ${session.isTyping ? 'text-green-500 font-medium' : 'text-gray-500'}`}>
                      {getLastMessagePreview(session)}
                    </p>
                  </div>
                  {session.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0 ml-1">
                      {session.unreadCount}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-black/20 min-w-0">
          {selectedUserId && selectedSession ? (
            <>
              {/* Header */}
              <div className="p-4 bg-[#18181b]/80 backdrop-blur-md border-b border-[#990000]/20 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-[#990000]/30 overflow-hidden bg-red-600/20 flex items-center justify-center">
                    {selectedSession.userPicture ? (
                      <img src={selectedSession.userPicture} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={20} className="text-red-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm flex items-center gap-2">
                      {selectedSession.userName}
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                    </h4>
                    <p className="text-[10px] text-gray-500">สถานะ: ออนไลน์ | User ID: #{selectedUserId}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-white transition"><Info size={18} /></button>
                </div>
              </div>

              {/* Messages */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 md:p-6 md:pr-4 space-y-4 md:space-y-6 flex flex-col scroll-smooth"
              >
                {selectedSession.messages.map((msg, i) => {
                  const showProduct = msg.metadata?.productId;
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div key={msg.id || i} className={`w-full flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'} ${isAdmin ? 'max-w-[75%] md:max-w-[50%] lg:max-w-[40%]' : 'max-w-[85%] md:max-w-[70%] lg:max-w-[65%]'}`}>
                        {showProduct && !isAdmin && (
                          <div className="mb-2 p-2 bg-[#18181b] border border-red-600/30 rounded-xl flex gap-3 max-w-[300px]">
                            {msg.metadata?.productImage && (
                              <img src={msg.metadata.productImage} className="w-12 h-12 rounded-lg object-cover" alt="" />
                            )}
                            <div className="min-w-0">
                              <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                                <Package size={10} /> สนใจสินค้า
                              </p>
                              <p className="text-xs text-white truncate font-medium">{msg.metadata?.productName}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className={`flex items-end gap-2 ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-1 border ${
                            isAdmin 
                              ? 'bg-red-600 border-red-400 shadow-[0_0_10px_rgba(220,38,38,0.5)]' 
                              : 'bg-red-600/20 border-red-600/30'
                          }`}>
                            {isAdmin ? (
                              <span className="text-[10px] font-bold text-white uppercase">AD</span>
                            ) : (
                              <UserIcon size={14} className="text-red-500" />
                            )}
                          </div>
                          
                          <div className={`group relative p-3.5 px-5 rounded-2xl text-[14px] leading-relaxed shadow-xl border ${
                            isAdmin 
                              ? 'bg-gradient-to-br from-red-600 via-red-600 to-red-700 text-white rounded-tr-none border-red-400' 
                              : 'bg-[#1e1e21] text-white border-white/10 rounded-tl-none'
                          }`}>
                            <span className="block text-white font-medium whitespace-pre-wrap">{msg.message}</span>
                            <div className={`text-[10px] mt-2 font-medium opacity-80 flex items-center gap-1.5 ${isAdmin ? 'justify-end text-red-100' : 'justify-start text-gray-400'}`}>
                              <Clock size={11} />
                              {formatTime(msg.createdAt)}
                              {isAdmin && <span className="ml-1 text-[11px] font-bold">✓✓</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {selectedSession.isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[#18181b]/80 text-green-500 text-xs py-2 px-5 rounded-full border border-green-500/30 italic animate-pulse shadow-lg">
                      {selectedSession.userName} กำลังพิมพ์...
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Responses */}
              <div className="px-4 py-2.5 border-t border-[#990000]/10 bg-black/40 overflow-x-auto shrink-0">
                <div className="flex gap-2 whitespace-nowrap">
                  <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5 self-center mr-3">
                    <Smile size={14} /> ตอบกลับด่วน:
                  </span>
                  {QUICK_RESPONSES.map((resp, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(undefined, resp)}
                      className="px-4 py-2 bg-[#18181b] border border-[#990000]/20 rounded-full text-[12px] text-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all active:scale-95"
                    >
                      {resp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-[#990000]/20 bg-[#18181b]/80 backdrop-blur-md flex gap-3 shrink-0">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="พิมพ์ข้อความตอบกลับ..."
                  className="flex-1 bg-black border border-[#990000]/30 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:border-red-600 transition-all shadow-inner placeholder:text-gray-600"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all flex items-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] active:scale-95"
                >
                  <Send size={18} /> ส่ง
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-50 space-y-6">
              <div className="w-32 h-32 rounded-full bg-red-600/5 border-2 border-dashed border-red-600/20 flex items-center justify-center">
                <MessageSquare size={64} className="text-red-900/40" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white mb-2">เริ่มการสนทนา</p>
                <p className="text-sm">โปรดเลือกแชทลูกค้าจากแถบด้านข้างเพื่อตรวจสอบและตอบกลับ</p>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </AdminLayout>
  );
};

export default AdminChat;
