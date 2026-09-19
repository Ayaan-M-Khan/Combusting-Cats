import React from 'react';

interface AvatarProps {
  id: string; // 'sharky' | 'bacon_cat' | 'schmoopy' | 'player'
  isDead?: boolean;
  className?: string;
}

export const AvatarIcon: React.FC<AvatarProps> = ({ id, isDead = false, className = 'w-16 h-16' }) => {
  if (isDead) {
    return (
      <div className={`relative rounded-full bg-stone-700 border-[3px] border-stone-900 flex items-center justify-center p-1.5 shadow-inner ${className}`}>
        {/* Skull icon */}
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-80">
          <circle cx="50" cy="46" r="30" fill="#e2e8f0" stroke="#1f2937" strokeWidth="4" />
          <rect x="36" y="66" width="28" height="18" rx="4" fill="#e2e8f0" stroke="#1f2937" strokeWidth="4" />
          {/* Eye sockets */}
          <circle cx="40" cy="48" r="8" fill="#1f2937" />
          <circle cx="60" cy="48" r="8" fill="#1f2937" />
          {/* Nose */}
          <polygon points="50,56 46,64 54,64" fill="#1f2937" />
          {/* Teeth */}
          <line x1="43" y1="72" x2="43" y2="82" stroke="#1f2937" strokeWidth="3" />
          <line x1="50" y1="72" x2="50" y2="82" stroke="#1f2937" strokeWidth="3" />
          <line x1="57" y1="72" x2="57" y2="82" stroke="#1f2937" strokeWidth="3" />
        </svg>
      </div>
    );
  }

  switch (id) {
    case 'sharky':
      return (
        <div className={`relative rounded-full bg-sky-600 border-[3px] border-stone-900 flex items-center justify-center overflow-hidden shadow-lg ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Ocean back */}
            <circle cx="50" cy="50" r="48" fill="#0284c7" />
            {/* Shark body */}
            <path d="M20 70 Q50 20 85 50 Q75 80 40 85 Z" fill="#94a3b8" stroke="#1e293b" strokeWidth="3" />
            {/* Shark belly */}
            <path d="M40 75 Q60 55 80 52 Q70 75 40 75 Z" fill="#f8fafc" />
            {/* Open mouth & teeth */}
            <path d="M46 62 Q60 48 76 56 Q62 70 46 62 Z" fill="#991b1b" stroke="#1e293b" strokeWidth="2" />
            <polygon points="52,58 55,54 58,58" fill="#ffffff" />
            <polygon points="60,56 63,52 66,56" fill="#ffffff" />
            <polygon points="68,56 71,52 74,58" fill="#ffffff" />
            {/* Eye */}
            <circle cx="62" cy="42" r="5" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
            <circle cx="62" cy="42" r="2.5" fill="#09090b" />
            {/* White shirt & tie */}
            <polygon points="26,76 44,70 38,94 22,90" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
            <polygon points="32,74 38,72 36,92 32,90" fill="#dc2626" />
          </svg>
        </div>
      );

    case 'bacon_cat':
      return (
        <div className={`relative rounded-full bg-amber-500 border-[3px] border-stone-900 flex items-center justify-center overflow-hidden shadow-lg ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Background */}
            <circle cx="50" cy="50" r="48" fill="#f59e0b" />
            {/* Cat ears */}
            <polygon points="25,35 36,15 48,32" fill="#d97706" stroke="#1e293b" strokeWidth="3" />
            <polygon points="52,32 64,15 75,35" fill="#d97706" stroke="#1e293b" strokeWidth="3" />
            {/* Cat head */}
            <circle cx="50" cy="54" r="30" fill="#fbbf24" stroke="#1e293b" strokeWidth="3" />
            {/* Bacon scarf! */}
            <path d="M15 70 Q35 62 55 72 Q75 62 85 70" stroke="#b91c1c" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M15 70 Q35 62 55 72 Q75 62 85 70" stroke="#fecaca" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Cat eyes */}
            <circle cx="40" cy="50" r="5" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
            <circle cx="40" cy="50" r="2.5" fill="#09090b" />
            <circle cx="60" cy="50" r="5" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
            <circle cx="60" cy="50" r="2.5" fill="#09090b" />
            {/* Whisker & nose */}
            <polygon points="48,56 52,56 50,60" fill="#ec4899" />
          </svg>
        </div>
      );

    case 'schmoopy':
      return (
        <div className={`relative rounded-full bg-pink-500 border-[3px] border-stone-900 flex items-center justify-center overflow-hidden shadow-lg ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Background */}
            <circle cx="50" cy="50" r="48" fill="#ec4899" />
            {/* Chubby cheeks */}
            <circle cx="50" cy="52" r="32" fill="#f472b6" stroke="#1e293b" strokeWidth="3" />
            {/* Ears */}
            <polygon points="28,30 38,12 48,26" fill="#f472b6" stroke="#1e293b" strokeWidth="3" />
            <polygon points="52,26 62,12 72,30" fill="#f472b6" stroke="#1e293b" strokeWidth="3" />
            {/* Huge derp kitten eyes */}
            <circle cx="38" cy="48" r="8" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
            <circle cx="38" cy="48" r="5" fill="#09090b" />
            <circle cx="40" cy="46" r="2" fill="#ffffff" />
            <circle cx="62" cy="48" r="8" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
            <circle cx="62" cy="48" r="5" fill="#09090b" />
            <circle cx="64" cy="46" r="2" fill="#ffffff" />
            {/* Cute mouth */}
            <path d="M46 62 Q50 66 54 62" stroke="#831843" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'player':
    default:
      return (
        <div className={`relative rounded-full bg-blue-500 border-[3px] border-stone-900 flex items-center justify-center overflow-hidden shadow-lg ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Background */}
            <circle cx="50" cy="50" r="48" fill="#2563eb" />
            {/* Blob character */}
            <ellipse cx="50" cy="52" rx="34" ry="30" fill="#3b82f6" stroke="#1e293b" strokeWidth="3" />
            {/* Curious eyes */}
            <circle cx="38" cy="46" r="7" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
            <circle cx="38" cy="46" r="3.5" fill="#09090b" />
            <circle cx="40" cy="44" r="1.5" fill="#ffffff" />
            <circle cx="62" cy="46" r="7" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
            <circle cx="62" cy="46" r="3.5" fill="#09090b" />
            <circle cx="64" cy="44" r="1.5" fill="#ffffff" />
            {/* Smirk */}
            <path d="M45 62 Q52 68 58 60" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      );
  }
};
