import React, { useState, useEffect } from 'react';
import type { Artisan } from '../App';

interface ArtisanFormModalProps {
  artisan: Artisan | null;
  onClose: () => void;
  onSave: (artisanData: Omit<Artisan, 'id'> | Artisan) => void;
}

const governorates = [
  "دمشق", "ريف دمشق", "حلب", "حمص", "حماة", "اللاذقية", "طرطوس",
  "درعا", "السويداء", "القنيطرة", "إدلب", "دير الزور", "الرقة", "الحسكة"
];

const emptyFormState: Omit<Artisan, 'id' | 'rating' | 'reviews'> = { 
  name: '', craft: '', governorate: '', phone: '', description: '',
  profileImage: null, coverImage: null, gallery: [] 
};

// Pexels API Key provided by the user
const PEXELS_API_KEY = 'DQ51Keh60ZQGSFqMaXItS2zMqcZsiFyYYx200B5wHKw9ycoQGxq4HCLY';


// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const ArtisanFormModal: React.FC<ArtisanFormModalProps> = ({ artisan, onClose, onSave }) => {
  const [formData, setFormData] = useState<Omit<Artisan, 'id' | 'rating' | 'reviews'>>(emptyFormState);
  const [isFetchingCover, setIsFetchingCover] = useState(false);

  useEffect(() => {
    if (artisan) {
      const {id, rating, reviews, ...editableData} = artisan;
      setFormData(editableData);
    } else {
      setFormData(emptyFormState);
    }
  }, [artisan]);
  
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImage' | 'coverImage') => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setFormData(prev => ({ ...prev, [field]: base64 }));
    }
  };
  
  const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const base64Promises = files.map(fileToBase64);
      const base64Images = await Promise.all(base64Promises);
      setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ...base64Images] }));
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({...prev, gallery: prev.gallery.filter((_, i) => i !== index)}));
  }

  const handleGenerateCover = async () => {
    if (!formData.craft.trim()) {
      alert('الرجاء إدخال الحرفة أولاً للبحث عن صورة.');
      return;
    }
    setIsFetchingCover(true);
    try {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(formData.craft)}&per_page=1&orientation=landscape`, {
        headers: {
          Authorization: PEXELS_API_KEY
        }
      });
      if (!response.ok) {
        throw new Error(`Pexels API Error: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.photos && data.photos.length > 0) {
        const imageUrl = data.photos[0].src.large;
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();
        const base64 = await fileToBase64(imageBlob as File);
        setFormData(prev => ({ ...prev, coverImage: base64 }));
      } else {
        alert('لم يتم العثور على صور لهذه الحرفة.');
      }
    } catch (error) {
      console.error("Error fetching cover image from Pexels:", error);
      alert('حدث خطأ أثناء جلب صورة الغلاف. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsFetchingCover(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (artisan) {
      onSave({ ...formData, id: artisan.id, rating: artisan.rating, reviews: artisan.reviews });
    } else {
      onSave(formData);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-60 py-10 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl m-4 transform transition-all duration-300 ease-in-out">
        <div className="p-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <h3 id="modal-title" className="text-2xl font-bold text-sky-800">
              {artisan ? 'تعديل بيانات الحرفي' : 'إضافة حرفي جديد'}
            </h3>
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors" aria-label="إغلاق">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                <input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="مثال: أحمد نجار" required className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 shadow-sm" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                <input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="مثال: 0912345678" required className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 shadow-sm" />
              </div>
              <div>
                 <label htmlFor="craft" className="block text-sm font-medium text-gray-700 mb-1">الحرفة</label>
                <input id="craft" name="craft" value={formData.craft} onChange={handleInputChange} placeholder="مثال: نجارة، حدادة" required className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 shadow-sm" />
              </div>
              <div>
                <label htmlFor="governorate" className="block text-sm font-medium text-gray-700 mb-1">المحافظة</label>
                <select id="governorate" name="governorate" value={formData.governorate} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-sky-500 shadow-sm">
                  <option value="">اختر المحافظة</option>
                  {governorates.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="وصف موجز عن الحرفي وخدماته" required className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 shadow-sm" rows={3}></textarea>
            </div>
             
             {/* Image Uploads */}
            <div className="space-y-6 pt-2">
              <div>
                <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">صورة الملف الشخصي</label>
                <div className="flex items-center gap-4">
                  <input type="file" id="profileImage" accept="image/*" onChange={e => handleImageChange(e, 'profileImage')} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100" />
                  {formData.profileImage && <img src={formData.profileImage} alt="Profile preview" className="h-16 w-16 rounded-full object-cover flex-shrink-0"/>}
                </div>
              </div>

              <div>
                <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">صورة الغلاف</label>
                <div className="flex items-center gap-2">
                    <input type="file" id="coverImage" accept="image/*" onChange={e => handleImageChange(e, 'coverImage')} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100" />
                    <button
                      type="button"
                      onClick={handleGenerateCover}
                      disabled={!formData.craft.trim() || isFetchingCover}
                      title={!formData.craft.trim() ? "أدخل الحرفة أولاً" : "بحث عن صورة غلاف تلقائياً"}
                      className="flex-shrink-0 p-2 border border-transparent rounded-full text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      aria-label="بحث عن صورة غلاف"
                    >
                      {isFetchingCover ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.586 2.586a2 2 0 012.828 0L18 5.172a2 2 0 010 2.828l-2.586 2.586a2 2 0 01-2.828 0L10 8.828l-2.586 2.586a2 2 0 01-2.828 0L2 8.828a2 2 0 010-2.828l2.586-2.586a2 2 0 012.828 0L10 5.172l2.586-2.586zM10 12a1 1 0 100 2h.01a1 1 0 100-2H10zm-3 2a1 1 0 100 2h.01a1 1 0 100-2H7zm6 0a1 1 0 100 2h.01a1 1 0 100-2H13z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                </div>
                {formData.coverImage && <img src={formData.coverImage} alt="Cover preview" className="mt-2 h-24 w-full rounded-md object-cover"/>}
              </div>

               <div>
                  <label htmlFor="gallery" className="block text-sm font-medium text-gray-700 mb-1">معرض الأعمال (يمكنك تحديد عدة صور)</label>
                  <input type="file" id="gallery" accept="image/*" multiple onChange={handleGalleryChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100" />
                   {formData.gallery.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {formData.gallery.map((img, index) => (
                           <div key={index} className="relative group">
                              <img src={img} alt={`Gallery image ${index+1}`} className="h-20 w-20 rounded-md object-cover"/>
                               <button type="button" onClick={() => removeGalleryImage(index)} className="absolute top-0 right-0 m-1 h-5 w-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                           </div>
                        ))}
                      </div>
                   )}
               </div>
            </div>

            <div className="flex gap-4 pt-4 justify-end border-t border-gray-200">
              <button type="button" onClick={onClose} className="px-6 py-2.5 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">إلغاء</button>
              <button type="submit" className="px-6 py-2.5 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors shadow-sm">{artisan ? 'حفظ التغييرات' : 'إضافة الحرفي'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArtisanFormModal;
