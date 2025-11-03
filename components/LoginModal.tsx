import React, { useState, useRef, useEffect } from 'react';
import type { LastLoggedInInfo } from '../App';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  quickLoginAccounts: LastLoggedInInfo[];
  onLogin: (username: string, password: string) => { success: boolean; message: string };
  onQuickLogin: (account: LastLoggedInInfo) => void;
  onRemoveQuickLoginAccount: (account: LastLoggedInInfo) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, quickLoginAccounts, onLogin, onQuickLogin, onRemoveQuickLoginAccount }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    // Reset form when modal is closed
    if (!isOpen) {
      setUsername('');
      setPassword('');
      setLoginMessage(null);
    }
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleLoginAttempt = () => {
    const result = onLogin(username, password);
    setLoginMessage({ text: result.message, isError: !result.success });
    if (!result.success) {
      setPassword('');
      setTimeout(() => setLoginMessage(null), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md m-4 transform animate-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center">
            <h2 id="login-modal-title" className="text-2xl font-bold text-sky-800">تسجيل الدخول إلى حِرَفي</h2>
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors" aria-label="إغلاق">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-6 space-y-6">
            {/* Quick Login Section */}
            {quickLoginAccounts.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-500">الدخول السريع</p>
                <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                {quickLoginAccounts.map(account => {
                    const id = account.type === 'admin' ? 'admin' : account.data.id;
                    return (
                    <div key={id} className="group flex items-center w-full text-right pr-2 pl-1 py-1 rounded-lg hover:bg-sky-100 transition-colors">
                        <button onClick={() => onQuickLogin(account)} className="flex items-center gap-3 flex-grow p-2" aria-label={`الدخول السريع كـ ${account.data.name}`}>
                        {account.data.profileImage ? <img src={account.data.profileImage} alt={account.data.name} className="h-10 w-10 rounded-full object-cover" />
                        : <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-lg flex-shrink-0">
                            {account.type === 'admin' ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-700" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg> : account.data.name.charAt(0)}
                            </div>}
                        <div className="flex-grow text-right overflow-hidden">
                          <span className="text-sm font-semibold text-gray-700 truncate block group-hover:text-sky-800 group-hover:font-bold">{account.data.name}</span>
                          <span className="text-xs text-gray-500 block truncate">{account.data.craft}</span>
                        </div>
                        </button>
                        <button onClick={() => onRemoveQuickLoginAccount(account)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-2 rounded-full transition-opacity flex-shrink-0" aria-label={`إزالة ${account.data.name} من الدخول السريع`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    )
                })}
                </div>
              </div>
            )}

            {quickLoginAccounts.length > 0 && (
                <div className="flex items-center text-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-sm text-gray-400">أو</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>
            )}

            {/* Manual Login Form */}
            <div className="space-y-4">
              <div>
                <label htmlFor="login-username-modal" className="sr-only">اسم المستخدم</label>
                <input id="login-username-modal" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="اسم المستخدم" className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow" />
              </div>
              <div>
                <label htmlFor="login-password-modal" className="sr-only">كلمة المرور</label>
                <input id="login-password-modal" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور" className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow" onKeyDown={(e) => e.key === 'Enter' && handleLoginAttempt()} />
              </div>
            </div>

            {loginMessage && <div className={`p-3 rounded-lg text-sm text-center font-semibold ${loginMessage.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{loginMessage.text}</div>}

            <button onClick={handleLoginAttempt} className="w-full px-4 py-3 text-lg bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 shadow-sm">
                دخول
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;