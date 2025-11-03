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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-200/80 space-y-5">
      {/* Search Input */}
      <div className="relative">
        <label htmlFor="search-input" className="sr-only">بحث</label>
        <input
          id="search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن حرفي، خدمة، أو وصف..."
          className="w-full h-14 pr-14 pl-5 text-lg text-white placeholder-gray-400 bg-gray-800 rounded-lg border-2 border-transparent focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-300 shadow-sm"
        />
        <div className="absolute top-0 right-0 h-full flex items-center pr-5 pointer-events-none">
          <svg className="w-6 h-6 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-2">
        {/* Governorate Filter */}
        <div className="relative">
          <label htmlFor="governorate-select" className="sr-only">المحافظة</label>
          <select
            id="governorate-select"
            value={selectedGovernorate}
            onChange={(e) => setSelectedGovernorate(e.target.value)}
            className={`w-full h-12 px-4 bg-white rounded-lg border border-gray-300 appearance-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-300 cursor-pointer shadow-sm ${selectedGovernorate ? 'text-gray-800' : 'text-gray-400'}`}
          >
            <option value="" className="text-gray-400">المحافظة</option>
            {governorates.map(gov => (
              <option key={gov} value={gov} className="text-gray-800">{gov}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none">
             <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Craft Type Filter */}
        <div className="relative">
          <label htmlFor="craft-select" className="sr-only">نوع الحرفة</label>
          <select
            id="craft-select"
            value={selectedCraft}
            onChange={(e) => setSelectedCraft(e.target.value)}
            className={`w-full h-12 px-4 bg-white rounded-lg border border-gray-300 appearance-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-300 cursor-pointer shadow-sm ${selectedCraft ? 'text-gray-800' : 'text-gray-400'}`}
          >
            <option value="" className="text-gray-400">نوع الحرفة</option>
            {crafts.map(craft => (
              <option key={craft} value={craft} className="text-gray-800">{craft}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;