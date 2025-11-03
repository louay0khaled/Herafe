import React from 'react';
import type { Artisan } from '../App';

interface ArtisanCardProps {
  artisan: Artisan;
  animationIndex: number;
}

const ArtisanCard: React.FC<ArtisanCardProps> = ({ artisan, animationIndex }) => {
  return (
    <div 
      className="bg-white rounded-2xl shadow-md p-6 border border-gray-200/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 transform animate-fade-in"
      style={{ animationDelay: `${animationIndex * 50}ms` }}
    >
      <div className="flex flex-col h-full">
        <div className="flex-grow space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-2xl font-bold text-gray-800">{artisan.name}</h3>
            <span className="text-sm font-semibold text-sky-700 bg-sky-100 px-3 py-1 rounded-full">{artisan.craft}</span>
          </div>
          
          <div className="pt-2 space-y-3">
              <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 ml-3 text-gray-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{artisan.governorate}</span>
              </div>
               <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 ml-3 text-gray-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="tracking-wider" dir="ltr">{artisan.phone}</span>
              </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-gray-500 text-sm">{artisan.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ArtisanCard;