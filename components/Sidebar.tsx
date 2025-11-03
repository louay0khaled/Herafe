import React, { useState, useRef } from 'react';
import type { Artisan, LastLoggedInInfo } from '../App';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isAdmin: boolean;
  loggedInArtisan: Artisan | null;
  quickLoginAccounts: LastLoggedInInfo[];
  onLogin: (username: string, password: string) => { success: boolean; message: string };
  onLogout: () => void;
  onViewConversations: () => void;
  onGoToHome: () => void;
  onQuickLogin: (account: LastLoggedInInfo) => void;
  onRemoveQuickLoginAccount: (account: LastLoggedInInfo) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, isAdmin, loggedInArtisan, quickLoginAccounts, onLogin, onLogout, onViewConversations, onGoToHome, onQuickLogin, onRemoveQuickLoginAccount }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleLoginAttempt = () => {
    const result = onLogin(username, password);
    setLoginMessage({ text: result.message, isError: !result.success });
    if (result.success) {
      setShowLogin(false);
      setUsername('');
    }
    setPassword('');
    setTimeout(() => setLoginMessage(null), 3000);
  };
  
  const handleLogoutClick = () => {
    onLogout();
    toggleSidebar();
  }

  const isLoggedIn = isAdmin || !!loggedInArtisan;

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-60 z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleSidebar} aria-hidden="true"></div>
      <aside className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} aria-labelledby="sidebar-title">
        <div className="p-5 h-full overflow-y-auto">
          <h2 id="sidebar-title" className="text-2xl font-bold text-sky-800">القائمة</h2>
          {loginMessage && <div className={`p-2.5 mt-4 rounded-lg text-sm text-center font-semibold ${loginMessage.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{loginMessage.text}</div>}
          <ul className="mt-6 space-y-2">
            <li><button onClick={onGoToHome} className="block w-full text-right px-4 py-3 rounded-lg text-lg hover:bg-sky-100 text-gray-700 transition-colors">الصفحة الرئيسية</button></li>
            {!isLoggedIn && <li><button onClick={onViewConversations} className="block w-full text-right px-4 py-3 rounded-lg text-lg hover:bg-sky-100 text-gray-700 transition-colors">محادثاتي</button></li>}
            <li><a href="#" className="block px-4 py-3 rounded-lg text-lg hover:bg-sky-100 text-gray-700 transition-colors">خدماتنا</a></li>
            <li><a href="#" className="block px-4 py-3 rounded-lg text-lg hover:bg-sky-100 text-gray-700 transition-colors">من نحن</a></li>
            <li><a href="#" className="block px-4 py-3 rounded-lg text-lg hover:bg-sky-100 text-gray-700 transition-colors">اتصل بنا</a></li>
          </ul>

          <div className="mt-6 pt-6 border-t border-gray-200">
              {isLoggedIn ? (
                  <div className="space-y-4">
                  {isAdmin && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-sky-50 rounded-lg">
                        <div className="h-12 w-12 rounded-full bg-sky-200 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-700" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg></div>
                        <div><span className="font-bold text-gray-800">المسؤول</span><span className="text-sm text-gray-500 block">لوحة التحكم</span></div>
                    </div>
                  )}
                  {loggedInArtisan && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-sky-50 rounded-lg">
                      {loggedInArtisan.profileImage ? <img src={loggedInArtisan.profileImage} alt={loggedInArtisan.name} className="h-12 w-12 rounded-full object-cover" /> : <div className="h-12 w-12 rounded-full bg-sky-200 flex items-center justify-center text-sky-700 font-bold text-xl flex-shrink-0">{loggedInArtisan.name.charAt(0)}</div>}
                      <div><span className="font-bold text-gray-800">{loggedInArtisan.name}</span><span className="text-sm text-gray-500 block">{loggedInArtisan.craft}</span></div>
                    </div>
                  )}
                  <button onClick={handleLogoutClick} className="w-full text-center block px-4 py-3 rounded-lg bg-red-50 text-red-600 font-bold text-lg hover:bg-red-100 transition-colors">تسجيل الخروج</button>
                </div>
              ) : (
                <div className="space-y-2">
                   {quickLoginAccounts.length > 0 && !showLogin && (
                    <div className="space-y-1">
                        <p className="px-4 pt-1 pb-2 text-xs font-semibold text-gray-400 uppercase">الدخول السريع</p>
                        {quickLoginAccounts.map(account => {
                             const id = account.type === 'admin' ? 'admin' : account.data.id;
                             return (
                                <div key={id} className="group flex items-center w-full text-right pr-2 pl-1 py-1 rounded-lg hover:bg-sky-50 transition-colors">
                                <button onClick={() => onQuickLogin(account)} className="flex items-center gap-3 flex-grow p-2" aria-label={`الدخول السريع كـ ${account.data.name}`}>
                                    {account.data.profileImage ? <img src={account.data.profileImage} alt={account.data.name} className="h-10 w-10 rounded-full object-cover" />
                                    : <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-lg flex-shrink-0">
                                        {account.type === 'admin' ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-700" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg> : account.data.name.charAt(0)}
                                      </div>}
                                    <div className="flex-grow"><span className="text-sm font-semibold">{account.data.name}</span><span className="text-xs text-gray-500 block">{account.data.craft}</span></div>
                                </button>
                                <button onClick={() => onRemoveQuickLoginAccount(account)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-2 rounded-full transition-opacity flex-shrink-0" aria-label={`إزالة ${account.data.name} من الدخول السريع`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                                </div>
                             )
                        })}
                    </div>
                  )}

                  <button onClick={() => setShowLogin(!showLogin)} className="w-full text-right block px-4 py-3 rounded-lg hover:bg-sky-100 text-gray-700 text-lg transition-colors border-t border-gray-100 mt-2 pt-3">{showLogin ? 'إلغاء' : 'تسجيل دخول يدوي'}</button>
                  {showLogin && (
                    <div className="p-3 mt-2 space-y-3 bg-sky-50 rounded-lg border border-sky-200">
                      <input id="login-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="اسم المستخدم" className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow" />
                      <input id="login-password" ref={passwordInputRef} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور" className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow" onKeyDown={(e) => e.key === 'Enter' && handleLoginAttempt()} />
                      <button onClick={handleLoginAttempt} className="w-full px-3 py-2.5 text-base bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">دخول</button>
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;