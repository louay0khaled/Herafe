import React from 'react';

interface SplashScreenProps {
  isHiding: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isHiding }) => {
  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#f8fafc] ${isHiding ? 'animate-fade-out-blur' : 'opacity-100'}`}
      aria-hidden={isHiding}
    >
      <div className="wipe-container">
        <h1 
          className="text-7xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-sky-700 tracking-wider select-none leading-relaxed py-2" 
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        >
          حِرَفي
        </h1>
      </div>
    </div>
  );
};

export default SplashScreen;
