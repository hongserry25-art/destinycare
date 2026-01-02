
import React from 'react';

export const MountainGraphic: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`absolute bottom-0 left-0 right-0 h-64 w-full overflow-hidden pointer-events-none ${className}`}>
    <div className="absolute bottom-[-20px] left-[-15%] w-[60%] h-48 rounded-[100%] bg-[#A89F8E] opacity-30 blur-sm" />
    <div className="absolute bottom-[-30px] right-[-10%] w-[55%] h-56 rounded-[100%] bg-[#9AAB94] opacity-30 blur-sm" />
    <div className="absolute bottom-[-40px] left-[10%] w-[45%] h-52 rounded-[100%] bg-[#8B7E66] opacity-60" />
    <div className="absolute bottom-[-20px] right-[5%] w-[50%] h-44 rounded-[100%] bg-[#7C8C74] opacity-60" />
    <div className="absolute bottom-[-50px] left-[25%] w-[50%] h-48 rounded-[100%] bg-[#5D5443] opacity-80" />
  </div>
);

export const CloudPattern: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 50C4.47715 50 0 45.5228 0 40C0 34.4772 4.47715 30 10 30C11.1627 30 12.274 30.1982 13.3168 30.5664C14.0759 24.3638 19.3486 19.5 25.75 19.5C27.9725 19.5 30.0526 20.0768 31.8665 21.0924C33.2458 15.6566 38.1634 11.5 44 11.5C45.3976 11.5 46.7456 11.728 48.0125 12.1528C49.5249 5.25057 55.6192 0 62.9 0C71.185 0 78 6.71573 78 15C78 16.5414 77.7225 18.0195 77.206 19.3956C79.6736 18.4975 82.3551 18 85.15 18C93.352 18 100 24.648 100 32.85C100 41.052 93.352 47.7 85.15 47.7C84.7571 47.7 84.3672 47.6848 83.9806 47.6548C83.2132 54.6074 77.3323 60 70.25 60C63.1677 60 57.2868 54.6074 56.5194 47.6548C56.1328 47.6848 55.7429 47.7 55.35 47.7C48.2677 47.7 42.3868 42.3074 41.6194 35.3548C41.2328 35.3848 40.8429 35.4 40.45 35.4C33.3677 35.4 27.4868 30.0074 26.7194 23.0548C26.3328 23.0848 25.9429 23.1 25.55 23.1C18.4677 23.1 12.5868 28.4926 11.8194 35.4452C11.4328 35.4152 11.0429 35.4 10.65 35.4C5.31979 35.4 1 39.7198 1 45.05C1 50.3802 5.31979 54.7 10.65 54.7H10V50Z" fill="#D4AF37" fillOpacity="0.15"/>
  </svg>
);

export const PremiumLogo: React.FC = () => (
  <div className="flex flex-col items-center gap-2">
    <span className="text-white opacity-60 text-[10px] tracking-[0.4em] mb-4">운명케어연구소</span>
    <div className="relative w-24 h-24 flex items-center justify-center">
      {/* Hanok Roof Pattern */}
      <svg className="absolute -top-6 w-28 h-10" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 30 C10 30, 20 10, 50 10 C80 10, 90 30, 90 30 L95 35 L85 30 L50 20 L15 30 L5 35 L10 30Z" fill="#D4AF37" />
        <path d="M45 5 L55 5 L50 0 L45 5Z" fill="#D4AF37" />
      </svg>
      {/* Square Border */}
      <div className="border-[2px] border-[#D4AF37] w-20 h-20 flex items-center justify-center relative overflow-hidden">
         <span className="text-5xl font-serif font-bold text-[#D4AF37] relative z-10">命</span>
      </div>
    </div>
    <span className="text-[#D4AF37] text-[10px] tracking-[0.4em] mt-2">운명케어연구소</span>
  </div>
);

export const HummingBirdGraphic: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 80 Q70 60, 90 85 T130 90 Q150 95, 170 105 L160 110 Q140 100, 120 105 T80 115 Z" fill="#D4AF37" fillOpacity="0.4" />
    <path d="M40 85 L20 100 L45 105 L40 85Z" fill="#D4AF37" fillOpacity="0.6" />
    <path d="M90 85 C90 85, 70 40, 50 50 C40 55, 60 75, 75 75 Z" fill="#D4AF37" fillOpacity="0.5" />
    <path d="M100 90 C100 90, 110 50, 130 60 C140 65, 120 85, 110 85 Z" fill="#D4AF37" fillOpacity="0.5" />
  </svg>
);

export const LeafDecoration: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Removed line/tick paths that looked like scratches per user request */}
    <circle cx="160" cy="180" r="60" fill="#D4AF37" fillOpacity="0.15" className="blur-3xl" />
    <circle cx="100" cy="150" r="40" fill="#D4AF37" fillOpacity="0.1" className="blur-2xl" />
  </svg>
);

export const RedStamp: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`w-14 h-14 border-[3px] border-red-600 rounded-lg flex items-center justify-center p-1 bg-white/10 shadow-sm ${className}`}>
    <span className="text-red-600 font-bold text-2xl font-serif">福</span>
  </div>
);
