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

const emptyFormState: Omit<Artisan, 'id'> = { name: '', craft: '', governorate: '', phone: '', description: '' };

const ArtisanFormModal: React.FC<ArtisanFormModalProps> = ({ artisan, onClose, onSave }) => {
  const [formData, setFormData] = useState<Omit<Artisan, 'id'>>(emptyFormState);

  useEffect(() => {
    if (artisan) {
      setFormData(artisan);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (artisan) {
      onSave({ ...formData, id: artisan.id });
    } else {
      onSave(formData);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
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
              <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="وصف موجز عن الحرفي وخدماته" required className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 shadow-sm" rows={4}></textarea>
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