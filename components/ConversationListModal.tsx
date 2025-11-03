import React from 'react';
import type { Conversation } from '../App';

interface ConversationListModalProps {
  conversations: Conversation[];
  onClose: () => void;
  onSelectConversation: (conversationId: string) => void;
}

const ConversationListModal: React.FC<ConversationListModalProps> = ({ conversations, onClose, onSelectConversation }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center py-6 bg-black bg-opacity-70 animate-fade-in overflow-y-auto"
      aria-labelledby="conversations-modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative bg-gray-50 rounded-2xl shadow-2xl w-full max-w-md m-4 transform transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 id="conversations-modal-title" className="text-xl font-bold text-sky-800">محادثاتي</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="إغلاق"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-3 space-y-2 max-h-[60vh] overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="text-center py-10 px-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="mt-2 font-semibold text-gray-700">لا توجد محادثات بعد</h3>
              <p className="text-sm text-gray-500">ابدأ محادثة مع أحد الحرفيين وستظهر هنا.</p>
            </div>
          ) : (
            conversations.map(convo => {
              const lastMessage = convo.messages.length > 0 ? convo.messages[convo.messages.length - 1] : null;
              return (
                <button
                  key={convo.id}
                  onClick={() => onSelectConversation(convo.id)}
                  className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-sky-100 transition-colors text-right"
                >
                  <div className="flex-shrink-0">
                    {convo.artisanProfileImage ? (
                      <img src={convo.artisanProfileImage} alt={convo.artisanName} className="h-12 w-12 rounded-full object-cover"/>
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-sky-200 flex items-center justify-center text-sky-700 font-bold text-xl">
                        {convo.artisanName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <h4 className="font-bold text-gray-800 truncate">{convo.artisanName}</h4>
                    <p className="text-sm text-gray-500 truncate">
                      {lastMessage ? (
                        <>
                           <span className={`font-semibold ${lastMessage.sender === 'user' ? 'text-gray-700' : 'text-sky-600'}`}>
                                {lastMessage.sender === 'user' ? 'أنت: ' : ''}
                            </span>
                          {lastMessage.text}
                        </>
                      ): 'لا توجد رسائل بعد'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationListModal;