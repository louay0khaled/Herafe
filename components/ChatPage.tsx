
import React, { useState, useRef, useEffect } from 'react';
import type { Artisan, Conversation } from '../App';

interface ChatPageProps {
  conversation: Conversation;
  artisan: Artisan;
  currentUserType: 'user' | 'artisan';
  onSendMessage: (conversationId: string, text: string) => void;
  onBack: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ conversation, artisan, currentUserType, onSendMessage, onBack }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timer);
  }, [conversation.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(conversation.id, inputText.trim());
      setInputText('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-sky-200 via-white to-blue-200 p-2 sm:p-4">
      <div className="w-full h-full bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center p-3 sm:p-4 bg-gray-50/80 backdrop-blur-sm z-10 flex-shrink-0 border-b border-gray-200">
          <button onClick={onBack} className="p-2 rounded-full text-sky-700 hover:bg-sky-100 transition-colors ml-3" aria-label="العودة إلى قائمة المحادثات">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
             {artisan.profileImage ? (
               <img src={artisan.profileImage} alt={artisan.name} className="h-10 w-10 rounded-full object-cover" />
             ) : (
               <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-xl">
                {artisan.name.charAt(0)}
               </div>
             )}
            <div>
              <h2 className="font-bold text-gray-800">{artisan.name}</h2>
              <p className="text-xs text-gray-500">متصل الآن</p>
            </div>
          </div>
        </header>
        
        {/* Messages */}
        <main 
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23dbeafe' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        >
          {conversation.messages.length === 0 && (
              <div className="text-center py-10 px-4 text-gray-500">
                  <p>هذه بداية محادثتك مع {artisan.name}.</p>
                  <p className="text-sm mt-1">يمكنك طرح الأسئلة حول خدماته أو طلب عرض أسعار.</p>
              </div>
          )}
          {conversation.messages.map(msg => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === currentUserType ? 'justify-end' : 'justify-start'}`}>
               {msg.sender !== currentUserType && (
                  <div className="flex-shrink-0 self-end mb-5">
                       {artisan.profileImage ? (
                           <img src={artisan.profileImage} alt={artisan.name} className="h-6 w-6 rounded-full object-cover" />
                       ) : (
                           <div className="h-6 w-6 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-xs">
                           {artisan.name.charAt(0)}
                           </div>
                       )}
                  </div>
              )}
              <div className={`py-2 px-4 rounded-2xl max-w-[75%] shadow-sm ${msg.sender === currentUserType ? 'bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-br-lg' : 'bg-white text-gray-800 rounded-bl-lg border border-gray-200'}`}>
                <p className="text-sm" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{msg.text}</p>
                <div className="text-right">
                    <span className={`text-xs mt-1 opacity-75 ${msg.sender === currentUserType ? 'text-sky-200' : 'text-gray-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString('ar-SA', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </main>

        {/* Input */}
        <footer className="p-3 bg-white border-t border-gray-200 flex-shrink-0">
          <form onSubmit={handleSend} className="flex items-center gap-3">
            <input 
              value={inputText} 
              onChange={e => setInputText(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="w-full h-12 px-4 text-base bg-gray-100 rounded-full border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
            <button type="submit" className="flex-shrink-0 h-12 w-12 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500" aria-label="إرسال">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform -rotate-45" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default ChatPage;
