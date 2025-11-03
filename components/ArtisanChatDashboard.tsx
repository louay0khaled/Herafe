import React from 'react';
import type { Artisan, Conversation } from '../App';

interface ArtisanChatDashboardProps {
  loggedInArtisan: Artisan;
  conversations: Conversation[];
  onViewChat: (conversationId: string) => void;
}

const ArtisanChatDashboard: React.FC<ArtisanChatDashboardProps> = ({ loggedInArtisan, conversations, onViewChat }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-sky-100">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-sky-800">مرحباً {loggedInArtisan.name}</h2>
        <p className="text-gray-600 mt-1">هذه هي لوحة تحكم المحادثات الخاصة بك. يمكنك من هنا الرد على استفسارات العملاء.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-sky-700 border-b pb-2 border-sky-200">قائمة المحادثات</h3>
        {conversations.length === 0 ? (
          <div className="text-center py-12 px-6 bg-sky-50 rounded-lg border-2 border-dashed border-sky-200">
            <h3 className="text-xl font-semibold text-sky-700">لا توجد محادثات لعرضها</h3>
            <p className="text-gray-500 mt-2">عندما يبدأ أحد العملاء محادثة معك، ستظهر هنا.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {conversations.map(convo => {
              const lastMessage = convo.messages.length > 0 ? convo.messages[convo.messages.length - 1] : null;
              return (
                <button 
                  key={convo.id} 
                  onClick={() => onViewChat(convo.id)} 
                  className="w-full text-right p-4 bg-white hover:bg-sky-50/50 transition-colors duration-200 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 flex-grow">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-lg text-sky-900">زبون ({convo.customerId.substring(convo.customerId.length - 6)})</h4>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {lastMessage ? (
                          <>
                            <span className={`font-semibold ${lastMessage.sender === 'artisan' ? 'text-sky-700' : ''}`}>
                                {lastMessage.sender === 'artisan' ? 'أنت: ' : ''}
                            </span>
                            {lastMessage.text}
                          </>
                        )
                        : 'ابدأ المحادثة...'}
                      </p>
                    </div>
                  </div>
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisanChatDashboard;
