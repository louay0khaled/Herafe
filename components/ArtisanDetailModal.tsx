import React, { useEffect, useState } from 'react';
import type { Artisan } from '../App';
import ImageLightbox from './ImageLightbox'; // Import the new lightbox component

interface ArtisanDetailModalProps {
  artisan: Artisan;
  onClose: () => void;
}

const ArtisanDetailModal: React.FC<ArtisanDetailModalProps> = ({ artisan, onClose }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Format phone number for links
  const formattedPhone = `+963${artisan.phone.substring(1)}`;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 animate-fade-in"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
      >
        <div
          className="relative bg-gray-50 rounded-2xl shadow-2xl w-full max-w-sm m-4 transform transition-all duration-300 ease-out overflow-hidden"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          style={{ animationName: 'modal-pop' }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 left-3 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            aria-label="إغلاق"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header Section */}
          <div className="relative">
            {artisan.coverImage ? (
                <img src={artisan.coverImage} alt="Cover" className="h-32 w-full object-cover rounded-t-2xl" />
            ) : (
                <div className="h-32 bg-gray-200 rounded-t-2xl"></div>
            )}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-28 h-28 bg-gray-300 rounded-full border-4 border-gray-50 flex items-center justify-center overflow-hidden">
               {artisan.profileImage ? (
                 <img src={artisan.profileImage} alt={artisan.name} className="w-full h-full object-cover" />
               ) : (
                 <span className="text-4xl text-gray-500">{artisan.name.charAt(0)}</span>
               )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 pt-16 text-center">
            <h2 id="modal-title" className="text-2xl font-bold text-gray-800">{artisan.name}</h2>
            <p className="text-gray-500">{artisan.craft}</p>

            <div className="flex justify-center items-center gap-4 text-gray-600 my-3 text-sm flex-wrap">
              <div className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{artisan.governorate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <strong>{artisan.rating.toFixed(1)}</strong>
                <span>({artisan.reviews} تقييم)</span>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="font-bold text-gray-700 mb-2">للتواصل</h3>
              <div className="flex gap-3">
                <a href={`https://wa.me/${formattedPhone}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413 0 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.687-1.475L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.888-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                  <span>واتساب</span>
                </a>
                <a href={`tel:${formattedPhone}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors shadow-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                   </svg>
                  <span>اتصال</span>
                </a>
              </div>
            </div>
            
             <button className="w-full flex items-center justify-center gap-2 mt-3 px-4 py-3 bg-yellow-100 text-yellow-800 font-bold rounded-lg hover:bg-yellow-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>تقييم الحرفي</span>
             </button>

            <div className="mt-6 text-right space-y-3">
              <div>
                 <h3 className="font-bold text-gray-700 text-lg mb-2">عن الحرفي</h3>
                 <p className="text-gray-600 text-sm leading-relaxed">{artisan.description}</p>
              </div>

              {artisan.gallery && artisan.gallery.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-700 text-lg mb-2">معرض الأعمال</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {artisan.gallery.map((image, index) => (
                      <button key={index} onClick={() => setLightboxIndex(index)} className="aspect-square rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-sky-500 ring-offset-2">
                        <img src={image} alt={`Work gallery ${index + 1}`} className="w-full h-full object-cover"/>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <style>{`
          @keyframes modal-pop {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={artisan.gallery}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
};

export default ArtisanDetailModal;