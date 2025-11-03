import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    // Reset form when modal is closed
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setLoginMessage(null);
      setLoading(false);
    }
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleLoginAttempt = async () => {
    setLoading(true);
    setLoginMessage(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginMessage({ text: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.', isError: true });
      setTimeout(() => setLoginMessage(null), 3000);
    } else {
      setLoginMessage({ text: 'تم تسجيل الدخول بنجاح!', isError: false });
      setTimeout(onClose, 1000); // Close modal on success
    }
    setLoading(false);
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
            <div className="space-y-4">
              <div>
                <label htmlFor="login-email-modal" className="sr-only">البريد الإلكتروني</label>
                <input id="login-email-modal" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني" required className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow" />
              </div>
              <div>
                <label htmlFor="login-password-modal" className="sr-only">كلمة المرور</label>
                <input id="login-password-modal" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور" required className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow" onKeyDown={(e) => e.key === 'Enter' && handleLoginAttempt()} />
              </div>
            </div>

            {loginMessage && <div className={`p-3 rounded-lg text-sm text-center font-semibold ${loginMessage.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{loginMessage.text}</div>}

            <button onClick={handleLoginAttempt} disabled={loading} className="w-full px-4 py-3 text-lg bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed">
              {loading ? 'جاري الدخول...' : 'دخول'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
