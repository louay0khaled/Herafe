import React from 'react';
import type { Artisan } from '../App';
import ArtisanCard from './ArtisanCard';

interface ArtisanListProps {
  artisans: Artisan[];
}

const ArtisanList: React.FC<ArtisanListProps> = ({ artisans }) => {
  if (artisans.length === 0) {
    return (
      <div className="text-center py-10 mt-8 max-w-2xl mx-auto bg-white/60 rounded-lg shadow">
        <svg className="mx-auto h-12 w-12 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="mt-2 text-lg font-semibold text-sky-800">لم يتم العثور على نتائج</h3>
        <p className="mt-1 text-sm text-gray-600">حاول تعديل كلمات البحث أو تغيير الفلاتر المستخدمة.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {artisans.map((artisan, index) => (
        <ArtisanCard key={artisan.id} artisan={artisan} animationIndex={index} />
      ))}
    </div>
  );
};

export default ArtisanList;