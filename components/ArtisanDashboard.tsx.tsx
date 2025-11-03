import React from 'react';
import type { Artisan, Conversation } from '../App';

interface ArtisanDashboardProps {
  loggedInArtisan: Artisan;
  conversations: Conversation[];
  onViewChat: (conversationId: string) => void;
}

const ArtisanDashboard: React.FC<ArtisanDashboardProps> = ({ loggedInArtisan, conversations, onViewChat }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Artisan Profile Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-sky-100 overflow-hidden">
        <div className="relative">
          {loggedInArtisan.coverImage ? (
            <img src={loggedInArtisan.coverImage} alt="Cover" className="h-32 w-full object-cover" />
          ) : (
            <div className="h-32 bg-gradient-to-r from-sky-50 to-sky-100"></div>
          )}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-36 h-36 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center overflow-hidden shadow-md">
            {loggedInArtisan.profileImage ? (
              <img src={loggedInArtisan.profileImage} alt={loggedInArtisan.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-6xl text-gray-500">{loggedInArtisan.name.charAt(0)}</span>
            )}
          </div>
        </div>
        <div className="p-6 pt-24 text-center">
          <h2 className="text-3xl font-bold text-gray-800">{loggedInArtisan.name}</h2>
          <p className="text-sky-700 font-semibold">{loggedInArtisan.craft}</p>
          <div className="flex justify-center items-center gap-4 text-gray-600 my-3 text-sm flex-wrap">
            <div className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
              <span>{loggedInArtisan.governorate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <strong>{loggedInArtisan.rating.toFixed(1)}</strong>
              <span>({loggedInArtisan.reviews} تقييم)</span>
            </div>
          </div>
          <div className="px-6 pb-6 text-center border-t border-gray-200 pt-4">
             <p className="text-gray-600 text-sm leading-relaxed">{loggedInArtisan.description}</p>
          </div>
        </div>
      </div>

      {/* Conversations Section */}
      <div className="p-4 sm:p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-sky-100">
        <h3 className="text-2xl font-semibold text-sky-800 border-b pb-3 mb-4 border-sky-200">محادثاتك مع الزبائن</h3>
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
                <button key={convo.id} onClick={() => onViewChat(convo.id)} className="w-full text-right p-4 bg-white hover:bg-sky-50/50 transition-colors duration-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-grow">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg></div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-lg text-sky-900">زبون ({convo.customerId.substring(convo.customerId.length - 6)})</h4>
                      <p className="text-sm text-gray-600 truncate mt-1">{lastMessage ? (<><span className={`font-semibold ${lastMessage.sender === 'artisan' ? 'text-sky-700' : ''}`}>{lastMessage.sender === 'artisan' ? 'أنت: ' : ''}</span>{lastMessage.text}</>) : 'ابدأ المحادثة...'}</p>
                    </div>
                  </div>
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisanDashboard;