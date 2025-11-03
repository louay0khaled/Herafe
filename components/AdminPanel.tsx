
import React, { useState } from 'react';
import type { Artisan } from '../App';
import ArtisanFormModal from './ArtisanFormModal'; // Import the new modal component

const AdminPanel: React.FC<AdminPanelProps> = ({ artisans, onAddArtisan, onUpdateArtisan, onDeleteArtisan }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtisan, setEditingArtisan] = useState<Artisan | null>(null);

  const handleAddNewClick = () => {
    setEditingArtisan(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (artisan: Artisan) => {
    setEditingArtisan(artisan);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الحرفي؟ لا يمكن التراجع عن هذا الإجراء.')) {
      onDeleteArtisan(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingArtisan(null);
  };

  const handleSaveArtisan = (artisanData: Omit<Artisan, 'id' | 'rating' | 'reviews'> | Artisan) => {
    if ('id' in artisanData) {
      onUpdateArtisan(artisanData);
    } else {
      // FIX: The type of artisanData now correctly matches what onAddArtisan expects, so the cast is removed.
      onAddArtisan(artisanData);
    }
    handleCloseModal();
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-sky-100">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-3xl font-bold text-sky-800">لوحة تحكم المسؤول</h2>
          <button
            onClick={handleAddNewClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-sky-600 hover:to-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-300 transform hover:-translate-y-0.5"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>إضافة حرفي جديد</span>
          </button>
        </div>

        <div className="space-y-4">
          {artisans.length === 0 ? (
            <div className="text-center py-12 px-6 bg-sky-50 rounded-lg border-2 border-dashed border-sky-200">
              <h3 className="text-xl font-semibold text-sky-700">لا يوجد حرفيون لعرضهم</h3>
              <p className="text-gray-500 mt-2">ابدأ بإضافة أول حرفي إلى المنصة من خلال الضغط على زر "إضافة حرفي جديد".</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              {artisans.map(artisan => (
                <div key={artisan.id} className="p-4 bg-white hover:bg-sky-50/50 transition-colors duration-200 flex items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-grow">
                    <div className="flex-shrink-0">
                      {artisan.profileImage ? (
                        <img src={artisan.profileImage} alt={artisan.name} className="h-12 w-12 rounded-full object-cover" />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-xl">
                          {artisan.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-lg text-sky-900">{artisan.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1 flex-wrap">
                          <span className="font-medium bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full">{artisan.craft}</span>
                          <span>{artisan.governorate}</span>
                          <span className="tracking-wider" dir="ltr">{artisan.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 self-end sm:self-center">
                    <button onClick={() => handleEditClick(artisan)} className="p-2 text-yellow-600 bg-yellow-100 rounded-full hover:bg-yellow-200 hover:text-yellow-700 transition-colors" aria-label="تعديل">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button onClick={() => handleDeleteClick(artisan.id)} className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200 hover:text-red-700 transition-colors" aria-label="حذف">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                        </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {isModalOpen && (
        <ArtisanFormModal
          artisan={editingArtisan}
          onClose={handleCloseModal}
          onSave={handleSaveArtisan}
        />
      )}
    </>
  );
};

export default AdminPanel;

interface AdminPanelProps {
  artisans: Artisan[];
  onAddArtisan: (artisan: Omit<Artisan, 'id' | 'rating' | 'reviews'>) => void;
  onUpdateArtisan: (artisan: Artisan) => void;
  onDeleteArtisan: (id: number) => void;
}
