import React from 'react';
import type { Artisan } from '../App';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isAdmin: boolean;
  onLogout: () => void;
  onViewConversations: () => void;
  onGoToHome: () => void;
  onInitiateLogin: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, isAdmin, onLogout, onViewConversations, onGoToHome, onInitiateLogin }) => {
  const isLoggedIn = isAdmin;
  const user = isAdmin ? { name: 'المسؤول', craft: 'لوحة التحكم', profile_image_url: null } : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
        aria-hidden="true"
      ></div>

      {/* Sidebar Panel - Solid and Opaque */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 sm:w-80 bg-white border-l border-gray-200 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 id="sidebar-title" className="text-xl font-bold text-slate-800">القائمة</h2>
            <button onClick={toggleSidebar} className="p-2 rounded-full text-slate-600 hover:bg-gray-100 hover:text-slate-800 transition-colors" aria-label="إغلاق القائمة">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-grow p-4 space-y-2">
            <NavItem icon={<HomeIcon />} text="الصفحة الرئيسية" onClick={onGoToHome} />
            {!isAdmin && (
              <NavItem icon={<ChatIcon />} text="محادثاتي" onClick={onViewConversations} />
            )}
          </nav>

          {/* Footer / User Section */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            {isLoggedIn && user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    { user.profile_image_url ? (
                      <img src={user.profile_image_url} alt={user.name} className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-xl">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{user.name}</p>
                    <p className="text-sm text-slate-600">{user.craft}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 hover:text-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <LogoutIcon />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onInitiateLogin}
                className="w-full px-4 py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                تسجيل الدخول
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

// Helper components for icons and nav items
const NavItem: React.FC<{ icon: React.ReactNode; text: string; onClick: () => void }> = ({ icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 p-3 rounded-lg text-slate-800 font-semibold hover:bg-sky-100 transition-all duration-200 text-right"
  >
    <span className="text-sky-700">{icon}</span>
    <span>{text}</span>
  </button>
);

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>;

export default Sidebar;