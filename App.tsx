import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import SearchSection from './components/SearchSection';
import AdminPanel from './components/AdminPanel';
import ArtisanList from './components/ArtisanList';

// Define the type for an artisan
export interface Artisan {
  id: number;
  name: string;
  craft: string;
  governorate: string;
  phone: string;
  description: string;
}

const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [artisans, setArtisans] = useState<Artisan[]>([
    { id: 1, name: 'أحمد نجار', craft: 'نجارة', governorate: 'ريف دمشق', phone: '0912345678', description: 'خبير في صناعة الأثاث المكتبي الكلاسيكي والمعاصر. جودة عالية وأسعار منافسة.' },
    { id: 2, name: 'فاطمة حداد', craft: 'حدادة', governorate: 'حلب', phone: '0987654321', description: 'متخصصة في تصميم وتنفيذ الأبواب والنوافذ الحديدية المزخرفة بأساليب فنية.' },
    { id: 3, name: 'سامر كهربجي', craft: 'كهرباء', governorate: 'حمص', phone: '0911223344', description: 'تمديد وصيانة جميع الشبكات الكهربائية للمنازل والمحلات التجارية بخبرة وأمانة.' },
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
  const addArtisan = (artisan: Omit<Artisan, 'id'>) => {
    setArtisans(prev => [...prev, { ...artisan, id: Date.now() }]);
  };

  const updateArtisan = (updatedArtisan: Artisan) => {
    setArtisans(prev => prev.map(a => a.id === updatedArtisan.id ? updatedArtisan : a));
  };

  const deleteArtisan = (id: number) => {
    setArtisans(prev => prev.filter(a => a.id !== id));
  };


  return (
    <div className="min-h-screen bg-transparent animate-fade-in">
       <header className="fixed top-0 left-0 right-0 z-30 text-center pt-6 pb-4">
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-sky-700 tracking-wider">
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
      <main className={`pt-28 px-4 sm:px-6 lg:px-8 pb-10 transition-all duration-300 ${isSidebarOpen ? 'blur-sm pointer-events-none' : ''}`}>
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
            <ArtisanList artisans={filteredArtisans} />
          </>
        )}
      </main>
    </div>
  );
};

export default App;
