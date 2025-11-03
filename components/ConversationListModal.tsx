import React from 'react';
import type { Conversation } from '../App';

interface ConversationListPageProps {
  conversations: Conversation[];
  onBack: () => void;
  onSelectConversation: (conversationId: string) => void;
}

const ConversationListPage: React.FC<ConversationListPageProps> = ({ conversations, onBack, onSelectConversation }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-sky-100">
        <div className="flex items-center mb-6">
            <button
                onClick={onBack}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors ml-4"
                aria-label="رجوع"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
            <h2 id="page-title" className="text-3xl font-bold text-sky-800">محادثاتي</h2>
        </div>

        <div className="space-y-2">
          {conversations.length === 0 ? (
            <div className="text-center py-12 px-6 bg-sky-50 rounded-lg border-2 border-dashed border-sky-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="mt-4 font-semibold text-gray-700 text-xl">لا توجد محادثات بعد</h3>
              <p className="mt-1 text-gray-500">ابدأ محادثة مع أحد الحرفيين وستظهر هنا.</p>
            </div>
          ) : (
             <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                {conversations.map(convo => {
                const lastMessage = convo.messages.length > 0 ? convo.messages[convo.messages.length - 1] : null;
                return (
                    <button
                    key={convo.id}
                    onClick={() => onSelectConversation(convo.id)}
                    className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-sky-100 transition-colors text-right"
                    >
                    <div className="flex-shrink-0">
                        {convo.artisanProfileImage ? (
                        <img src={convo.artisanProfileImage} alt={convo.artisanName} className="h-14 w-14 rounded-full object-cover"/>
                        ) : (
                        <div className="h-14 w-14 rounded-full bg-sky-200 flex items-center justify-center text-sky-700 font-bold text-2xl">
                            {convo.artisanName.charAt(0)}
                        </div>
                        )}
                    </div>
                    <div className="flex-grow overflow-hidden">
                        <h4 className="font-bold text-lg text-gray-800 truncate">{convo.artisanName}</h4>
                        <p className="text-sm text-gray-500 truncate mt-1">
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    </button>
                );
                })
            )}
            </div>
          )}
        </div>
    </div>
  );
};

export default ConversationListPage;