import React, { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isAdmin: boolean;
  onLogin: (password: string) => boolean;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, isAdmin, onLogin, onLogout }) => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleAdminLoginAttempt = () => {
    const success = onLogin(password);
    if (success) {
      setLoginMessage({ text: 'تم تسجيل الدخول بنجاح!', isError: false });
      setShowAdminLogin(false);
    } else {
      setLoginMessage({ text: 'كلمة المرور غير صحيحة.', isError: true });
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
            {isAdmin ? (
               <li>
                 <button
                   onClick={handleLogoutClick}
                   className="w-full text-right block px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 font-bold text-lg transition-colors"
                 >
                   تسجيل الخروج
                 </button>
               </li>
            ) : (
              <li>
                <button
                  onClick={() => setShowAdminLogin(!showAdminLogin)}
                  className="w-full text-right block px-4 py-3 rounded-lg hover:bg-sky-100 text-gray-700 text-lg transition-colors"
                >
                  تسجيل الدخول كمسؤول
                </button>
                {showAdminLogin && (
                  <div className="p-3 mt-2 space-y-3 bg-sky-50 rounded-lg border border-sky-200">
                    <label htmlFor="admin-password" className="sr-only">كلمة المرور</label>
                    <input
                      id="admin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="كلمة المرور"
                      className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
                      onKeyDown={(e) => e.key === 'Enter' && handleAdminLoginAttempt()}
                    />
                    <button
                      onClick={handleAdminLoginAttempt}
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