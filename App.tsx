
import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SearchSection from './components/SearchSection';
import AdminPanel from './components/AdminPanel';
import ArtisanList from './components/ArtisanList';
import ArtisanDetailModal from './components/ArtisanDetailModal';
import ArtisanDashboard from './components/ArtisanDashboard';
import ChatPage from './components/ChatPage';
import ConversationListPage from './components/ConversationListPage';

// --- TYPE DEFINITIONS ---

export interface Artisan {
  id: number;
  name: string;
  craft: string;
  governorate: string;
  phone: string;
  description: string;
  rating: number;
  reviews: number;
  profileImage: string | null;
  coverImage: string | null;
  gallery: string[];
  username?: string;
  password?: string;
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'artisan';
  timestamp: number;
}

export interface Conversation {
  id: string; // Composite key: "customerId-artisanId"
  artisanId: number;
  customerId: string;
  messages: Message[];
  artisanName: string;
  artisanProfileImage: string | null;
}

// Updated to support id for artisans
export interface QuickLoginData {
    id?: number;
    // FIX: Made username optional to align with Artisan type, resolving type error on login.
    username?: string;
    name: string;
    profileImage?: string | null;
    craft?: string;
}

export interface LastLoggedInInfo {
  type: 'admin' | 'artisan';
  data: QuickLoginData;
}

// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedInArtisan, setLoggedInArtisan] = useState<Artisan | null>(null);
  const [quickLoginAccounts, setQuickLoginAccounts] = useState<LastLoggedInInfo[]>([]);
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [view, setView] = useState<'main' | 'chatList' | 'chatDetail'>('main');
  
  // Chat state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string>('');

  const [artisans, setArtisans] = useState<Artisan[]>([]);
  
  // Initial customer ID and login setup from local storage
  useEffect(() => {
    let id = localStorage.getItem('hirafy_customer_id');
    if (!id) {
      id = `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('hirafy_customer_id', id);
    }
    setCustomerId(id);

    const storedAccounts = localStorage.getItem('hirafy_quickLoginAccounts');
    if (storedAccounts) {
        setQuickLoginAccounts(JSON.parse(storedAccounts));
    }

    const loggedInId = localStorage.getItem('hirafy_loggedInId');
    if (loggedInId && artisans.length > 0) {
        if (loggedInId === 'admin') {
            setIsAdmin(true);
            setLoggedInArtisan(null);
        } else {
            const currentArtisan = artisans.find(a => a.id === parseInt(loggedInId, 10));
            if (currentArtisan) {
                setLoggedInArtisan(currentArtisan);
                setIsAdmin(false);
            }
        }
    }
  }, [artisans]); // Rerun when artisans list is populated


  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGovernorate, setSelectedGovernorate] = useState('');
  const [selectedCraft, setSelectedCraft] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleGoToHome = () => {
    setView('main');
    setSidebarOpen(false);
  };

  const handleLogin = (username: string, password: string): { success: boolean; message: string } => {
    const loginAndStoreAccount = (accountInfo: LastLoggedInInfo) => {
        setQuickLoginAccounts(prev => {
            const isPresent = prev.some(acc => {
                if(acc.type === 'admin') return accountInfo.type === 'admin';
                return acc.data.id === accountInfo.data.id;
            });

            const newList = isPresent ? prev : [...prev, accountInfo];
            localStorage.setItem('hirafy_quickLoginAccounts', JSON.stringify(newList));
            return newList;
        });

        if (accountInfo.type === 'admin') {
            setIsAdmin(true);
            setLoggedInArtisan(null);
            localStorage.setItem('hirafy_loggedInId', 'admin');
        } else {
            setLoggedInArtisan(accountInfo.data as Artisan);
            setIsAdmin(false);
            localStorage.setItem('hirafy_loggedInId', String((accountInfo.data as Artisan).id));
        }
        setSidebarOpen(false);
    };

    if (username.toLowerCase() === 'l_ouai' && password === 'أنا لؤي') {
      const adminInfo: LastLoggedInInfo = { type: 'admin', data: { username: 'l_ouai', name: 'المسؤول', craft: 'لوحة التحكم' } };
      loginAndStoreAccount(adminInfo);
      return { success: true, message: 'تم تسجيل الدخول كمسؤول بنجاح!' };
    }

    const artisan = artisans.find(a => a.username === username && a.password === password);
    if (artisan) {
      const artisanInfo: LastLoggedInInfo = { type: 'artisan', data: artisan };
      loginAndStoreAccount(artisanInfo);
      return { success: true, message: `أهلاً بك، ${artisan.name}!` };
    }

    return { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة.' };
  };

  const handleQuickLogin = (account: LastLoggedInInfo) => {
    if (account.type === 'admin') {
      setIsAdmin(true);
      setLoggedInArtisan(null);
      localStorage.setItem('hirafy_loggedInId', 'admin');
    } else if (account.data.id) {
      const artisanToLogin = artisans.find(a => a.id === account.data.id);
      if (artisanToLogin) {
        setLoggedInArtisan(artisanToLogin);
        setIsAdmin(false);
        localStorage.setItem('hirafy_loggedInId', String(artisanToLogin.id));
      }
    }
    setSidebarOpen(false);
  };

  const handleRemoveQuickLoginAccount = (account: LastLoggedInInfo) => {
     setQuickLoginAccounts(prev => {
        const newList = prev.filter(acc => {
            if (acc.type === 'admin') return account.type !== 'admin';
            return acc.data.id !== account.data.id;
        });
        localStorage.setItem('hirafy_quickLoginAccounts', JSON.stringify(newList));
        return newList;
     });
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setLoggedInArtisan(null);
    localStorage.removeItem('hirafy_loggedInId');
    setView('main');
  };
  
  // --- Scroll lock for modals ---
  useEffect(() => {
    const isModalActuallyOpen = !!selectedArtisan || isSidebarOpen;
    if (isModalActuallyOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedArtisan, isSidebarOpen]);

  const handleViewArtisan = (artisan: Artisan) => setSelectedArtisan(artisan);
  const handleCloseArtisanModal = () => setSelectedArtisan(null);
  
  const handleRateArtisan = (artisanId: number, rating: number) => {
    const updateLogic = (prevArtisan: Artisan) => {
      const newReviews = prevArtisan.reviews + 1;
      const newRating = ((prevArtisan.rating * prevArtisan.reviews) + rating) / newReviews;
      return { ...prevArtisan, rating: newRating, reviews: newReviews };
    };
    setArtisans(prev => prev.map(a => a.id === artisanId ? updateLogic(a) : a));
    setSelectedArtisan(prev => (prev && prev.id === artisanId) ? updateLogic(prev) : prev);
  };
  
  // --- CHAT HANDLERS / NAVIGATION ---
  const handleStartChat = (artisan: Artisan) => {
    const conversationId = `${customerId}-${artisan.id}`;
    if (!conversations.some(c => c.id === conversationId)) {
      setConversations(prev => [...prev, {
        id: conversationId,
        artisanId: artisan.id,
        customerId,
        messages: [],
        artisanName: artisan.name,
        artisanProfileImage: artisan.profileImage
      }]);
    }
    setSelectedArtisan(null);
    setActiveConversationId(conversationId);
    setView('chatDetail');
  };
  
  const handleViewChat = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setView('chatDetail');
  }

  const handleBackFromChat = () => {
    setActiveConversationId(null);
    setView(loggedInArtisan ? 'main' : 'chatList');
  };

  const handleSendMessage = (conversationId: string, text: string) => {
    const newMessage: Message = { id: Date.now(), text, sender: loggedInArtisan ? 'artisan' : 'user', timestamp: Date.now() };
    setConversations(prev =>
      prev.map(convo => convo.id === conversationId ? { ...convo, messages: [...convo.messages, newMessage] } : convo)
    );
  };

  const handleViewConversationList = () => {
    setSidebarOpen(false);
    setView('chatList');
  };

  const uniqueCrafts = useMemo(() => [...new Set(artisans.map(a => a.craft.trim()).filter(Boolean))].sort(), [artisans]);
  const uniqueGovernorates = useMemo(() => [...new Set(artisans.map(a => a.governorate.trim()).filter(Boolean))].sort(), [artisans]);

  const filteredArtisans = useMemo(() => {
    return artisans.filter(artisan => {
      const query = searchQuery.toLowerCase().trim();
      return (
        (artisan.name.toLowerCase().includes(query) || artisan.craft.toLowerCase().includes(query) || artisan.description.toLowerCase().includes(query)) &&
        (!selectedGovernorate || artisan.governorate === selectedGovernorate) &&
        (!selectedCraft || artisan.craft === selectedCraft)
      );
    });
  }, [artisans, searchQuery, selectedGovernorate, selectedCraft]);

  const addArtisan = (artisan: Omit<Artisan, 'id' | 'rating' | 'reviews'>) => setArtisans(prev => [...prev, { ...artisan, id: Date.now(), rating: 0, reviews: 0 }]);
  const updateArtisan = (updatedArtisan: Artisan) => setArtisans(prev => prev.map(a => a.id === updatedArtisan.id ? updatedArtisan : a));
  const deleteArtisan = (id: number) => setArtisans(prev => prev.filter(a => a.id !== id));

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const artisanForActiveChat = activeConversation ? artisans.find(a => a.id === activeConversation.artisanId) : null;

  const renderView = () => {
    switch(view) {
        case 'chatList':
            return <ConversationListPage conversations={conversations} onBack={() => setView('main')} onSelectConversation={handleViewChat} />;
        case 'chatDetail':
            if (activeConversation && artisanForActiveChat) {
                return <ChatPage conversation={activeConversation} artisan={artisanForActiveChat} currentUserType={loggedInArtisan ? 'artisan' : 'user'} onSendMessage={handleSendMessage} onBack={handleBackFromChat} />;
            }
            setView('main');
            return null;
        case 'main':
        default:
            if (isAdmin) {
                return <AdminPanel artisans={artisans} onAddArtisan={addArtisan} onUpdateArtisan={updateArtisan} onDeleteArtisan={deleteArtisan} />;
            }
            if (loggedInArtisan) {
                return <ArtisanDashboard loggedInArtisan={loggedInArtisan} conversations={conversations.filter(c => c.artisanId === loggedInArtisan.id)} onViewChat={handleViewChat} />;
            }
            return <>
                <SearchSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedGovernorate={selectedGovernorate} setSelectedGovernorate={setSelectedGovernorate} governorates={uniqueGovernorates} selectedCraft={selectedCraft} setSelectedCraft={setSelectedCraft} crafts={uniqueCrafts} />
                <ArtisanList artisans={filteredArtisans} onViewArtisan={handleViewArtisan} />
            </>;
    }
  }

  return (
    <div className="min-h-screen bg-transparent animate-fade-in">
       <header className="fixed top-0 left-0 right-0 z-30 text-center pt-6 pb-4">
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-sky-700 tracking-wider select-none leading-relaxed py-2">حِرَفي</h1>
      </header>
      
      <button onClick={toggleSidebar} className="fixed top-8 right-4 sm:right-6 lg:right-8 z-40 p-2 rounded-full text-sky-600 bg-white/80 backdrop-blur-sm shadow-md hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors" aria-label="فتح القائمة">
        <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isAdmin={isAdmin}
        loggedInArtisan={loggedInArtisan}
        quickLoginAccounts={quickLoginAccounts}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onViewConversations={handleViewConversationList}
        onGoToHome={handleGoToHome}
        onQuickLogin={handleQuickLogin}
        onRemoveQuickLoginAccount={handleRemoveQuickLoginAccount}
      />

      <main className={`pt-28 px-4 sm:px-6 lg:px-8 pb-10 transition-all duration-300 ${isSidebarOpen || !!selectedArtisan ? 'blur-sm pointer-events-none' : ''}`}>
        {renderView()}
      </main>

      {selectedArtisan && (<ArtisanDetailModal artisan={selectedArtisan} onClose={handleCloseArtisanModal} onRate={handleRateArtisan} onStartChat={handleStartChat} />)}
    </div>
  );
};

export default App;
