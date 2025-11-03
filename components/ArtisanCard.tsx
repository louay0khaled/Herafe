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
      className="relative bg-white rounded-2xl shadow-md p-6 border border-gray-200/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 transform animate-fade-in text-right w-full flex items-center gap-6 overflow-hidden hover:border-sky-300"
      style={{ animationDelay: `${animationIndex * 50}ms` }}
      aria-label={`عرض تفاصيل ${artisan.name}`}
    >
      {/* Cover Image Background */}
      {artisan.cover_image_url && (
        <img
          src={artisan.cover_image_url}
          alt=""
          aria-hidden="true"
          className="absolute top-0 left-0 h-full w-2/3 object-cover z-0 opacity-25"
          style={{
            maskImage: 'linear-gradient(to right, black 40%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, black 40%, transparent 100%)',
          }}
        />
      )}

      {/* Profile Image */}
      <div className="flex-shrink-0 relative z-10">
        {artisan.profile_image_url ? (
          <img src={artisan.profile_image_url} alt={artisan.name} className="h-28 w-28 rounded-full object-cover" />
        ) : (
          <div className="h-28 w-28 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-4xl">
            {artisan.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Artisan Info */}
      <div className="flex-grow flex justify-between items-center relative z-10">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{artisan.name}</h3>
          <div className="flex items-center text-gray-600 text-base mt-1">
            <svg className="w-4 h-4 ml-2 text-gray-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{artisan.governorate}</span>
          </div>
        </div>
        
        <span className="text-sm font-semibold text-sky-800 px-4 py-2 rounded-full flex-shrink-0 border border-sky-800">
          {artisan.craft}
        </span>
      </div>
    </button>
  );
};

export default ArtisanCard;
