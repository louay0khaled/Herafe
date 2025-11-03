import React, { useState, useEffect } from 'react';
import type { Artisan } from '../App';
import { supabase } from '../supabaseClient';

interface ArtisanFormModalProps {
  artisan: Artisan | null;
  onSave: (artisanData: Omit<Artisan, 'id' | 'rating' | 'reviews' | 'auth_user_id'> | Artisan, password?: string) => void;
  onClose: () => void;
  onDeleteGalleryImage: (imageUrl: string) => Promise<void>;
}

const governorates = [
  "دمشق", "ريف دمشق", "حلب", "حمص", "حماة", "اللاذقية", "طرطوس",
  "درعا", "السويداء", "القنيطرة", "إدلب", "دير الزور", "الرقة", "الحسكة"
];

const emptyFormState = { 
  name: '', craft: '', governorate: '', phone: '', description: '', email: '',
  profile_image_url: null, cover_image_url: null, gallery_urls: [],
};


// Helper to upload a file to Supabase Storage
const uploadImage = async (file: File, type: 'profile_image_url' | 'cover_image_url' | 'gallery'): Promise<string | null> => {
    let bucketName: string;
    switch (type) {
        case 'profile_image_url':
            bucketName = 'profile-images';
            break;
        case 'cover_image_url':
            bucketName = 'cover-images';
            break;
        case 'gallery':
            bucketName = 'gallery-images';
            break;
        default:
            console.error('Invalid image upload type:', type);
            return null;
    }

    const fileName = `${Date.now()}_${file.name}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

    if (uploadError) {
        console.error(`Error uploading file to bucket '${bucketName}':`, uploadError);
        return null;
    }

    const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
    
    return data.publicUrl;
};

const ArtisanFormModal: React.FC<ArtisanFormModalProps> = ({ artisan, onClose, onSave, onDeleteGalleryImage }) => {
  const [formData, setFormData] = useState<any>(emptyFormState);
  const [password, setPassword] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (artisan) {
      const {id, rating, reviews, auth_user_id, ...editableData} = artisan;
      setFormData(editableData);
    } else {
      setFormData(emptyFormState);
    }
    setPassword('');
  }, [artisan]);
  
  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, field: 'profile_image_url' | 'cover_image_url') => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const publicUrl = await uploadImage(e.target.files[0], field);
      if(publicUrl) {
        setFormData(prev => ({ ...prev, [field]: publicUrl }));
      }
      setIsUploading(false);
    }
  };
  
  const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsUploading(true);
      const files = Array.from(e.target.files);
      // Fix: Add a type assertion `as File` because TypeScript incorrectly infers `file` as `unknown`.
      const uploadPromises = files.map(file => uploadImage(file as File, 'gallery'));
      const urls = (await Promise.all(uploadPromises)).filter(Boolean) as string[];
      setFormData(prev => ({ ...prev, gallery_urls: [...prev.gallery_urls, ...urls] }));
      setIsUploading(false);
    }
  };

  const removeGalleryImage = async (index: number) => {
    const urlToRemove = formData.gallery_urls[index];
    
    // First, attempt to delete the image from storage via RPC
    await onDeleteGalleryImage(urlToRemove);
    
    // Then, update the local state regardless of deletion success
    // to ensure the UI updates immediately.
    setFormData(prev => ({...prev, gallery_urls: prev.gallery_urls.filter((_, i) => i !== index)}));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !artisan;
    const finalPassword = isNew || password.trim() !== '' ? password.trim() : undefined;

    if (isNew) {
        if (!finalPassword) {
            alert('يجب إدخال كلمة مرور للحرفي الجديد.');
            return;
        }
        onSave(formData, finalPassword);
    } else if (artisan) {
        const fullArtisanData = { ...formData, id: artisan.id, rating: artisan.rating, reviews: artisan.reviews, auth_user_id: artisan.auth_user_id };
        onSave(fullArtisanData, finalPassword);
    }
  };
  
  const isNewArtisan = !artisan;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-60 py-10 overflow-y-auto"
      aria-labelledby="modal-title" role="dialog" aria-modal="true"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true"></div>
      
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl m-4 transform transition-all duration-300 ease-in-out">
        <div className="p-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <h3 id="modal-title" className="text-2xl font-bold text-sky-800">
              {artisan ? 'تعديل بيانات الحرفي' : 'إضافة حرفي جديد'}
            </h3>
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors" aria-label="إغلاق">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
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

            {/* Auth credentials */}
            <div className="p-4 bg-sky-50/50 rounded-lg border border-sky-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني (للدخول)</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="artisan@example.com" required className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 shadow-sm" />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                    <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isNewArtisan ? "كلمة مرور قوية" : "اتركه فارغاً للحفاظ عليها"} required={isNewArtisan} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 shadow-sm" />
                </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="وصف موجز عن الحرفي وخدماته" required className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 shadow-sm" rows={3}></textarea>
            </div>
             
             {/* Image Uploads */}
            <div className="space-y-6 pt-4 mt-4 border-t border-gray-200">
              <div>
                <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">صورة الملف الشخصي</label>
                <div className="flex items-center gap-4">
                  <input type="file" id="profileImage" accept="image/*" onChange={e => handleImageChange(e, 'profile_image_url')} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100" />
                  {formData.profile_image_url && <img src={formData.profile_image_url} alt="Profile preview" className="h-16 w-16 rounded-full object-cover flex-shrink-0"/>}
                </div>
              </div>

              <div>
                <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">صورة الغلاف</label>
                  <input type="file" id="coverImage" accept="image/*" onChange={e => handleImageChange(e, 'cover_image_url')} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100" />
                {formData.cover_image_url && <img src={formData.cover_image_url} alt="Cover preview" className="mt-2 h-24 w-full rounded-md object-cover"/>}
              </div>

               <div>
                  <label htmlFor="gallery" className="block text-sm font-medium text-gray-700 mb-1">معرض الأعمال (يمكنك تحديد عدة صور)</label>
                  <input type="file" id="gallery" accept="image/*" multiple onChange={handleGalleryChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100" />
                   {formData.gallery_urls.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {formData.gallery_urls.map((img: string, index: number) => (
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
              <button type="submit" disabled={isUploading} className="px-6 py-2.5 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed">
                {isUploading ? 'يتم الرفع...' : artisan ? 'حفظ التغييرات' : 'إضافة الحرفي'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArtisanFormModal;