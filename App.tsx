import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Sidebar from './components/Sidebar';
import SearchSection from './components/SearchSection';
import AdminPanel from './components/AdminPanel';
import ArtisanList from './components/ArtisanList';
import ArtisanDetailModal from './components/ArtisanDetailModal';
import ChatPage from './components/ChatPage';
import ConversationListPage from './components/ConversationListPage';
import LoginModal from './components/LoginModal';
import SplashScreen from './components/SplashScreen';

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
  profile_image_url: string | null;
  cover_image_url: string | null;
  gallery_urls: string[];
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
  artisan_profile_image_url: string | null;
}

// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [splashState, setSplashState] = useState<'visible' | 'hiding' | 'hidden'>('visible');
  const [session, setSession] = useState<any | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [view, setView] = useState<'main' | 'chatList' | 'chatDetail'>('main');
  
  // Chat state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string>('');

  const [artisans, setArtisans] = useState<Artisan[]>([]);

  // Splash Screen Effect
  useEffect(() => {
    const hideTimer = setTimeout(() => setSplashState('hiding'), 2500);
    const removeTimer = setTimeout(() => setSplashState('hidden'), 3000);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, []);
  
  // Fetch artisans and handle auth state changes
  useEffect(() => {
    // Fetch all artisans from the database
    const fetchArtisans = async () => {
        const { data, error } = await supabase.from('artisans').select('*');
        if (error) console.error('Error fetching artisans:', error);
        else setArtisans(data || []);
    };
    fetchArtisans();

    // Set up Supabase auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: string, session: any) => {
        setSession(session);
        if (session?.user?.email?.endsWith('@admin.hirafy')) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Customer ID for chat
  useEffect(() => {
    let id = localStorage.getItem('hirafy_customer_id');
    if (!id) {
      id = `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('hirafy_customer_id', id);
    }
    setCustomerId(id);
  }, []);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGovernorate, setSelectedGovernorate] = useState('');
  const [selectedCraft, setSelectedCraft] = useState('');

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  
  const handleInitiateLogin = () => {
    setSidebarOpen(false);
    setLoginModalOpen(true);
  };

  const handleGoToHome = () => {
    setView('main');
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('main');
  };
  
  // --- Scroll lock for modals ---
  useEffect(() => {
    const isModalActuallyOpen = !!selectedArtisan || isSidebarOpen || isLoginModalOpen;
    document.body.style.overflow = isModalActuallyOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedArtisan, isSidebarOpen, isLoginModalOpen]);

  const handleViewArtisan = (artisan: Artisan) => setSelectedArtisan(artisan);
  const handleCloseArtisanModal = () => setSelectedArtisan(null);
  
  const handleRateArtisan = (artisanId: number, rating: number) => {
    // This should be a database update in a real scenario
    console.log(`Rating artisan ${artisanId} with ${rating}`);
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
        artisan_profile_image_url: artisan.profile_image_url
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
    setView('chatList');
  };

  const handleSendMessage = (conversationId: string, text: string) => {
    // This should insert a message into the 'messages' table
    const newMessage: Message = { id: Date.now(), text, sender: 'user', timestamp: Date.now() };
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

  const addArtisan = async (artisanData: Omit<Artisan, 'id' | 'rating' | 'reviews'>) => {
    const { data, error } = await supabase.from('artisans').insert([artisanData]).select();
    if (error) {
      console.error('Error adding artisan:', error);
    } else if (data) {
      setArtisans(prev => [...prev, data[0]]);
    }
  };

  const updateArtisan = async (updatedArtisan: Artisan) => {
    const { id, ...updateData } = updatedArtisan;
    const { data, error } = await supabase.from('artisans').update(updateData).eq('id', id).select();
    if (error) {
      console.error('Error updating artisan:', error);
    } else if (data) {
      setArtisans(prev => prev.map(a => a.id === id ? data[0] : a));
    }
  };

  const deleteArtisan = async (id: number) => {
    const { error } = await supabase.from('artisans').delete().eq('id', id);
    if (error) {
      console.error('Error deleting artisan:', error);
    } else {
      setArtisans(prev => prev.filter(a => a.id !== id));
    }
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const artisanForActiveChat = activeConversation ? artisans.find(a => a.id === activeConversation.artisanId) : null;

  const renderView = () => {
    if (view === 'chatDetail' && activeConversation && artisanForActiveChat) {
      return (
        <ChatPage
          conversation={activeConversation}
          artisan={artisanForActiveChat}
          currentUserType={'user'}
          onSendMessage={handleSendMessage}
          onBack={handleBackFromChat}
        />
      );
    }

    const mainContent = () => {
        switch(view) {
            case 'chatList':
                return <ConversationListPage conversations={conversations} onBack={() => setView('main')} onSelectConversation={handleViewChat} />;
            case 'main':
            default:
                if (isAdmin) {
                    return <AdminPanel artisans={artisans} onAddArtisan={addArtisan} onUpdateArtisan={updateArtisan} onDeleteArtisan={deleteArtisan} />;
                }
                return <>
                    <SearchSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedGovernorate={selectedGovernorate} setSelectedGovernorate={setSelectedGovernorate} governorates={uniqueGovernorates} selectedCraft={selectedCraft} setSelectedCraft={setSelectedCraft} crafts={uniqueCrafts} />
                    <ArtisanList artisans={filteredArtisans} onViewArtisan={handleViewArtisan} />
                </>;
        }
    }

    const isBlured = isSidebarOpen || !!selectedArtisan || isLoginModalOpen;

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-30 text-center pt-6 pb-4 bg-white/70 backdrop-blur-sm shadow-sm">
                <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-sky-700 tracking-wider select-none leading-relaxed py-2" style={{textShadow: '0 2px 8px rgba(0,0,0,0.05)'}}>حِرَفي</h1>
            </header>
            
            <button 
              onClick={toggleSidebar} 
              className="fixed top-8 right-4 sm:right-6 lg:right-8 z-50 p-2 rounded-full text-sky-600 bg-white/80 backdrop-blur-sm shadow-md hover:bg-sky-100 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition" 
              aria-label="فتح/إغلاق القائمة">
                <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>

            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                isAdmin={isAdmin}
                onLogout={handleLogout}
                onViewConversations={handleViewConversationList}
                onGoToHome={handleGoToHome}
                onInitiateLogin={handleInitiateLogin}
            />

            <main className={`pt-32 px-4 sm:px-6 lg:px-8 pb-10 transition-all duration-300 ${isBlured ? 'blur-md pointer-events-none' : ''}`}>
                {mainContent()}
            </main>
        </>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      {splashState !== 'hidden' && <SplashScreen isHiding={splashState === 'hiding'} />}
      
      {renderView()}

      {selectedArtisan && (<ArtisanDetailModal artisan={selectedArtisan} onClose={handleCloseArtisanModal} onRate={handleRateArtisan} onStartChat={handleStartChat} />)}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </div>
  );
};

export default App;