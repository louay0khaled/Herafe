import React, { useState } from 'react';
import type { Artisan } from '../App';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isAdmin: boolean;
  loggedInArtisan: Artisan | null;
  onLogin: (username: string, password: string) => { success: boolean; message: string };
  onLogout: () => void;
  onOpenConversationList: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, isAdmin, loggedInArtisan, onLogin, onLogout, onOpenConversationList }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleLoginAttempt = () => {
    const result = onLogin(username, password);
    setLoginMessage({ text: result.message, isError: !result.success });
    
    if (result.success) {
      setShowLogin(false);
      setUsername('');
    }
    setPassword('');

    setTimeout(() => {
      setLoginMessage(null);
    }, 3000);
  };
  
  const handleLogoutClick = () => {
    onLogout();
    toggleSidebar();
  }

  const isLoggedIn = isAdmin || !!loggedInArtisan;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-labelledby="sidebar-title"
      >
        <div className="p-5">
          <h2 id="sidebar-title" className="text-2xl font-bold text-sky-800">القائمة</h2>
          
          {loginMessage && (
            <div className={`p-2.5 mt-4 rounded-lg text-sm text-center font-semibold ${loginMessage.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {loginMessage.text}
            </div>
          )}

          <ul className="mt-6 space-y-2">
            <li>
              <button
                onClick={toggleSidebar}
                className="block w-full text-right px-4 py-3 rounded-lg text-lg hover:bg-sky-100 text-gray-700 transition-colors"
              >
                الصفحة الرئيسية
              </button>
            </li>
            {!isLoggedIn && (
               <li>
                <button
                  onClick={onOpenConversationList}
                  className="block w-full text-right px-4 py-3 rounded-lg text-lg hover:bg-sky-100 text-gray-700 transition-colors"
                >
                  المحادثات
                </button>
              </li>
            )}
            <li>
              <a href="#" className="block px-4 py-3 rounded-lg text-lg hover:bg-sky-100 text-gray-700 transition-colors">
                خدماتنا
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-3 rounded-lg text-lg hover:bg-sky-100 text-gray-700 transition-colors">
                من نحن
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-3 rounded-lg text-lg hover:bg-sky-100 text-gray-700 transition-colors">
                اتصل بنا
              </a>
            </li>
            <hr className="my-4 border-gray-200" />
            {isLoggedIn ? (
               <>
                {isAdmin && (
                  <li>
                    <span className="block px-4 py-3 text-lg text-gray-700 font-semibold">
                      لوحة تحكم المسؤول
                    </span>
                  </li>
                )}
                {loggedInArtisan && (
                  <li>
                    <span className="block px-4 py-3 text-lg text-gray-700">
                      أهلاً بك، <span className="font-bold">{loggedInArtisan.name}</span>
                    </span>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-right block px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 font-bold text-lg transition-colors"
                  >
                    تسجيل الخروج
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={() => setShowLogin(!showLogin)}
                  className="w-full text-right block px-4 py-3 rounded-lg hover:bg-sky-100 text-gray-700 text-lg transition-colors"
                >
                  تسجيل الدخول
                </button>
                {showLogin && (
                  <div className="p-3 mt-2 space-y-3 bg-sky-50 rounded-lg border border-sky-200">
                    <label htmlFor="login-username" className="sr-only">اسم المستخدم</label>
                    <input
                      id="login-username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="اسم المستخدم"
                      className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
                    />
                    <label htmlFor="login-password" className="sr-only">كلمة المرور</label>
                    <input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="كلمة المرور"
                      className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
                      onKeyDown={(e) => e.key === 'Enter' && handleLoginAttempt()}
                    />
                    <button
                      onClick={handleLoginAttempt}
                      className="w-full px-3 py-2.5 text-base bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                    >
                      دخول
                    </button>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;