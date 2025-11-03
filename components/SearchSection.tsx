import React from 'react';

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGovernorate: string;
  setSelectedGovernorate: (governorate: string) => void;
  governorates: string[];
  selectedCraft: string;
  setSelectedCraft: (craft: string) => void;
  crafts: string[];
}

const SearchSection: React.FC<SearchSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedGovernorate,
  setSelectedGovernorate,
  governorates,
  selectedCraft,
  setSelectedCraft,
  crafts
}) => {
  return (
    <div className="max-w-4xl mx-auto p-5 bg-white/70 backdrop-blur-sm rounded-2xl shadow-md border border-sky-100 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <label htmlFor="search-input" className="sr-only">بحث</label>
        <div className="absolute top-0 right-0 h-full flex items-center pr-4 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          id="search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن حرفي، خدمة، أو وصف..."
          className="w-full h-12 pr-12 pl-4 text-base text-gray-800 placeholder-gray-500 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-300"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Governorate Filter */}
        <div className="relative">
          <label htmlFor="governorate-select" className="sr-only">المحافظة</label>
           <div className="absolute top-0 right-0 h-full flex items-center pr-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
          </div>
          <select
            id="governorate-select"
            value={selectedGovernorate}
            onChange={(e) => setSelectedGovernorate(e.target.value)}
            className={`w-full h-12 pr-10 pl-4 bg-white rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-300 cursor-pointer ${selectedGovernorate ? 'text-gray-800' : 'text-gray-500'}`}
          >
            <option value="" className="text-gray-500">اختر المحافظة</option>
            {governorates.map(gov => (
              <option key={gov} value={gov} className="text-gray-800">{gov}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none">
             <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Craft Type Filter */}
        <div className="relative">
          <label htmlFor="craft-select" className="sr-only">نوع الحرفة</label>
          <div className="absolute top-0 right-0 h-full flex items-center pr-3 pointer-events-none">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
          </div>
          <select
            id="craft-select"
            value={selectedCraft}
            onChange={(e) => setSelectedCraft(e.target.value)}
            className={`w-full h-12 pr-10 pl-4 bg-white rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-300 cursor-pointer ${selectedCraft ? 'text-gray-800' : 'text-gray-500'}`}
          >
            <option value="" className="text-gray-500">اختر نوع الحرفة</option>
            {crafts.map(craft => (
              <option key={craft} value={craft} className="text-gray-800">{craft}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
