import React, { useEffect, useState } from 'react';
import type { Artisan } from '../App';
import ImageLightbox from './ImageLightbox'; // Import the new lightbox component

interface ArtisanDetailModalProps {
  artisan: Artisan;
  onClose: () => void;
  onRate: (artisanId: number, rating: number) => void;
  onStartChat: (artisan: Artisan) => void;
}

const ArtisanDetailModal: React.FC<ArtisanDetailModalProps> = ({ artisan, onClose, onRate, onStartChat }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isRating, setIsRating] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  // Check if user has already rated this artisan on mount
  useEffect(() => {
    const ratedArtisans = JSON.parse(localStorage.getItem('rated_artisans') || '[]');
    if (ratedArtisans.includes(artisan.id)) {
      setHasRated(true);
    }
  }, [artisan.id]);
  
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

  const handleRatingSubmit = (rating: number) => {
    onRate(artisan.id, rating);
    const ratedArtisans = JSON.parse(localStorage.getItem('rated_artisans') || '[]');
    localStorage.setItem('rated_artisans', JSON.stringify([...ratedArtisans, artisan.id]));
    setHasRated(true);
    setIsRating(false);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-start justify-center py-6 bg-black bg-opacity-70 animate-fade-in overflow-y-auto"
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
            {artisan.cover_image_url ? (
                <img src={artisan.cover_image_url} alt="Cover" className="h-32 w-full object-cover rounded-t-2xl" />
            ) : (
                <div className="h-32 bg-gray-200 rounded-t-2xl"></div>
            )}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-36 h-36 bg-gray-300 rounded-full border-4 border-gray-50 flex items-center justify-center overflow-hidden shadow-lg">
               {artisan.profile_image_url ? (
                 <img src={artisan.profile_image_url} alt={artisan.name} className="w-full h-full object-cover" />
               ) : (
                 <span className="text-6xl text-gray-500">{artisan.name.charAt(0)}</span>
               )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 pt-24 text-center">
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
                <button onClick={() => onStartChat(artisan)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a2 2 0 01-2 2H9.574a1 1 0 01-.84-1.55l.08-.135A4.002 4.002 0 0113.8 6.5H15z" />
                  </svg>
                  <span>تواصل فوراً</span>
                </button>
                <a href={`tel:${formattedPhone}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors shadow-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                   </svg>
                  <span>اتصال</span>
                </a>
              </div>
            </div>
            
            <div className="mt-3">
              {hasRated ? (
                <div className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-500 font-bold rounded-lg cursor-not-allowed">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span>تم التقييم</span>
                </div>
              ) : isRating ? (
                <StarRating onSubmit={handleRatingSubmit} />
              ) : (
                <button onClick={() => setIsRating(true)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-100 text-yellow-800 font-bold rounded-lg hover:bg-yellow-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  <span>تقييم الحرفي</span>
                </button>
              )}
            </div>

            <div className="mt-6 text-right space-y-3">
              <div>
                 <h3 className="font-bold text-gray-700 text-lg mb-2">عن الحرفي</h3>
                 <p className="text-gray-600 text-sm leading-relaxed">{artisan.description}</p>
              </div>

              {artisan.gallery_urls && artisan.gallery_urls.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-700 text-lg mb-2">معرض الأعمال</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {artisan.gallery_urls.map((image, index) => (
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
          images={artisan.gallery_urls}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
};


const ratingMessages = [
  'سيء جداً',
  'سيء',
  'مقبول',
  'جيد',
  'ممتاز'
];

const StarRating: React.FC<{ onSubmit: (rating: number) => void }> = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating);
    }
  };

  const currentRatingValue = hover || rating;
  const message = currentRatingValue > 0 ? ratingMessages[currentRatingValue - 1] : 'اختر تقييمك بالضغط على النجوم';

  return (
    <div className="w-full p-4 bg-yellow-50 border border-yellow-200 rounded-lg transition-all duration-300 text-center">
      <div
        className="flex justify-center items-center flex-row-reverse"
        onMouseLeave={() => setHover(0)}
      >
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <button
              key={starValue}
              type="button"
              className="text-4xl transition-all duration-200 transform hover:scale-125 focus:outline-none"
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHover(starValue)}
              aria-label={`تقييم ${starValue} من 5 نجوم`}
            >
              <span className={starValue <= currentRatingValue ? 'text-yellow-400' : 'text-gray-300'}>
                &#9733;
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-center text-sm font-semibold text-yellow-800 mt-2 h-5 transition-opacity duration-200">
        {message}
      </p>
      <button
        onClick={handleSubmit}
        disabled={rating === 0}
        className="w-full mt-4 px-4 py-2.5 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
      >
        إرسال التقييم
      </button>
    </div>
  );
};


export default ArtisanDetailModal;
