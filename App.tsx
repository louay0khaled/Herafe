import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SearchSection from './components/SearchSection';
import AdminPanel from './components/AdminPanel';
import ArtisanList from './components/ArtisanList';
import ArtisanDetailModal from './components/ArtisanDetailModal'; // Import the new modal

// Define the type for an artisan
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
}

const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null); // State for the detail modal

  const [artisans, setArtisans] = useState<Artisan[]>([
    { 
      id: 1, 
      name: 'أحمد نجار', 
      craft: 'نجارة', 
      governorate: 'ريف دمشق', 
      phone: '0912345678', 
      description: 'خبير في صناعة الأثاث المكتبي الكلاسيكي والمعاصر. جودة عالية وأسعار منافسة.', 
      rating: 4.8, 
      reviews: 15,
      profileImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYwYTVmYSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMCAyMWE0IDQgMCAwIDAtNCA0aC04YTQgNCAwIDAgMC00LTRWM2E0IDQgMCAwIDEgNC00aDhhNCA0IDAgMCAxIDQgNHoiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSI0Ii8+PHBhdGggZD0iTTcuNDcgMjEuMTNhMTIgMTIgMCAwIDEgOS4wNiAwIi8+PC9zdmc+',
      coverImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgNDAgMTUiPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxNSIgZmlsbD0iI2U1ZjRlYSIvPjxwYXRoIGQ9Ik0gNSA1IEwgMTIgMyBMIDE5IDYgTCAyNSA0IEwgMzIgNyBMIDM1IDUiIHN0cm9rZT0iI2M0ZDRlZSIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48cGF0aCBkPSJNIDUgMTIgTCAxMCA5IEwgMTcgMTIgTCAyOCAxMCBMIDM1IDExIiBzdHJva2U9IiNiZmRiZGEiIGZpbGw9Im5vbmUiIHN0cm9rZS1dpZHRoPSIwLjUiLz48L3N2Zz4=',
      gallery: [
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IiNlN2VkZWMiPjxwYXRoIGQ9Ik0gNCA0IEwgMjAgNCBMIDIwIDIwIEwgNCAyMCBaIi8+PHBhdGggZD0iTSA2IDcgTCAxMCAxMiBMIDE0IDkgTCAxOCA4IEwgMTggMTggTCA2IDE4IFoiIGZpbGw9IiNhM2FlYWYiLz48Y2lyY2xlIGN4PSIxNiIgY3k9IjciIHI9IjIiIGZpbGw9IiNmYmMxNjQiLz48L3N2Zz4=',
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IiNlZGU5ZTQiPjxwYXRoIGQ9Ik0gNCA0IEwgMjAgNCBMIDIwIDIwIEwgNCAyMCBaIi8+PHBhdGggZD0iTSA0IDE4IEwgNyAxNCBMIDEyIDE2IEwgMTUgMTMgTCAyMCAxNyBMIDIwIDE4IFoiIGZpbGw9IiNiYmI1YWQiLz48cmVjdCB4PSI4IiB5PSI4IiB3aWR0aD0iOCIgaGVpZ2h0PSI2IiBmaWxsPSIjNjg2MTJjIi8+PC9zdmc+',
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IiNmMmYwZTYiPjxwYXRoIGQ9Ik0gNCA0IEwgMjAgNCBMIDIwIDIwIEwgNCAyMCBaIi8+PHBhdGggZD0iTSA1IDUgTCAxOSA1IEwgMTIgMTggWiIgZmlsbD0iI2Q0Yzc5ZSIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iMiIgZmlsbD0iI2E5ODk3YiIvPjwvc3ZnPg=='
      ] 
    },
  ]);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGovernorate, setSelectedGovernorate] = useState('');
  const [selectedCraft, setSelectedCraft] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogin = (password: string): boolean => {
    if (password === 'أنا لؤي') {
      setIsAdmin(true);
      setSidebarOpen(false); // Close sidebar on successful login
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };
  
  // --- Scroll lock for modal ---
  useEffect(() => {
    const isModalActuallyOpen = !!selectedArtisan;
    if (isModalActuallyOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedArtisan]);

  // --- Handlers for Artisan Detail Modal ---
  const handleViewArtisan = (artisan: Artisan) => {
    setSelectedArtisan(artisan);
  };

  const handleCloseArtisanModal = () => {
    setSelectedArtisan(null);
  };
  
  const handleRateArtisan = (artisanId: number, rating: number) => {
    setArtisans(prev =>
      prev.map(artisan => {
        if (artisan.id === artisanId) {
          const newReviews = artisan.reviews + 1;
          const newRating = ((artisan.rating * artisan.reviews) + rating) / newReviews;
          return { ...artisan, rating: newRating, reviews: newReviews };
        }
        return artisan;
      })
    );
     // Update selectedArtisan as well to see the change live in the modal
    setSelectedArtisan(prev => {
        if (prev && prev.id === artisanId) {
             const newReviews = prev.reviews + 1;
             const newRating = ((prev.rating * prev.reviews) + rating) / newReviews;
             return { ...prev, rating: newRating, reviews: newReviews };
        }
        return prev;
    });
  };

  // --- Dynamic Filter Options ---
  const uniqueCrafts = useMemo(() => {
    const crafts = artisans.map(a => a.craft.trim()).filter(Boolean);
    return [...new Set(crafts)].sort();
  }, [artisans]);

  const uniqueGovernorates = useMemo(() => {
    const governorates = artisans.map(a => a.governorate.trim()).filter(Boolean);
    return [...new Set(governorates)].sort();
  }, [artisans]);


  // Memoized filtered artisans for performance
  const filteredArtisans = useMemo(() => {
    return artisans.filter(artisan => {
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = 
        artisan.name.toLowerCase().includes(query) ||
        artisan.craft.toLowerCase().includes(query) ||
        artisan.description.toLowerCase().includes(query);
      
      const matchesGovernorate = selectedGovernorate ? artisan.governorate === selectedGovernorate : true;
      const matchesCraft = selectedCraft ? artisan.craft === selectedCraft : true;

      return matchesQuery && matchesGovernorate && matchesCraft;
    });
  }, [artisans, searchQuery, selectedGovernorate, selectedCraft]);


  // --- Artisan CRUD Functions ---
  const addArtisan = (artisan: Omit<Artisan, 'id' | 'rating' | 'reviews'>) => {
     setArtisans(prev => [...prev, { ...artisan, id: Date.now(), rating: 0, reviews: 0 }]);
  };

  const updateArtisan = (updatedArtisan: Artisan) => {
    setArtisans(prev => prev.map(a => a.id === updatedArtisan.id ? updatedArtisan : a));
  };

  const deleteArtisan = (id: number) => {
    setArtisans(prev => prev.filter(a => a.id !== id));
  };

  const isBackdropVisible = isSidebarOpen || !!selectedArtisan;

  return (
    <div className="min-h-screen bg-transparent animate-fade-in">
       <header className="fixed top-0 left-0 right-0 z-30 text-center pt-6 pb-4">
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-sky-700 tracking-wider select-none leading-relaxed py-2">
          حِرَفي
        </h1>
      </header>
      
      <button
          onClick={toggleSidebar}
          className="fixed top-8 right-4 sm:right-6 lg:right-8 z-40 p-2 rounded-full text-sky-600 bg-white/80 backdrop-blur-sm shadow-md hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
          aria-label="فتح القائمة"
        >
          <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isAdmin={isAdmin}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <main className={`pt-28 px-4 sm:px-6 lg:px-8 pb-10 transition-all duration-300 ${isBackdropVisible ? 'blur-sm pointer-events-none' : ''}`}>
        {isAdmin ? (
          <AdminPanel
            artisans={artisans}
            onAddArtisan={addArtisan}
            onUpdateArtisan={updateArtisan}
            onDeleteArtisan={deleteArtisan}
          />
        ) : (
          <>
            <SearchSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedGovernorate={selectedGovernorate}
              setSelectedGovernorate={setSelectedGovernorate}
              governorates={uniqueGovernorates}
              selectedCraft={selectedCraft}
              setSelectedCraft={setSelectedCraft}
              crafts={uniqueCrafts}
            />
            <ArtisanList artisans={filteredArtisans} onViewArtisan={handleViewArtisan} />
          </>
        )}
      </main>

      {selectedArtisan && (
        <ArtisanDetailModal 
          artisan={selectedArtisan}
          onClose={handleCloseArtisanModal}
          onRate={handleRateArtisan}
        />
      )}
    </div>
  );
};

export default App;