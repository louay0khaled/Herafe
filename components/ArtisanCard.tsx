import React from 'react';
import type { Artisan } from '../App';

interface ArtisanCardProps {
  artisan: Artisan;
  animationIndex: number;
  onView: (artisan: Artisan) => void;
}

const ArtisanCard: React.FC<ArtisanCardProps> = ({ artisan, animationIndex, onView }) => {
  return (
    <button
      onClick={() => onView(artisan)}
      className="bg-white rounded-2xl shadow-md p-4 border border-gray-200/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 transform animate-fade-in text-right w-full flex items-center gap-4"
      style={{ animationDelay: `${animationIndex * 50}ms` }}
      aria-label={`عرض تفاصيل ${artisan.name}`}
    >
      <div className="flex-shrink-0">
        {artisan.profileImage ? (
          <img src={artisan.profileImage} alt={artisan.name} className="h-24 w-24 rounded-full object-cover" />
        ) : (
          <div className="h-24 w-24 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-3xl">
            {artisan.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex-grow space-y-2 self-start pt-2">
        <div>
          <span className="text-xs font-semibold text-sky-700 bg-sky-100 px-2.5 py-1 rounded-full">{artisan.craft}</span>
          <h3 className="text-xl font-bold text-gray-800 mt-1">{artisan.name}</h3>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm">
            <svg className="w-4 h-4 ml-2 text-gray-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{artisan.governorate}</span>
        </div>
        
        <p className="text-gray-500 text-sm line-clamp-2 pt-1">{artisan.description}</p>
      </div>
    </button>
  );
};

export default ArtisanCard;
