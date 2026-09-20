import React from 'react';

interface AvatarProps {
  id: string; // 'sharky' | 'bacon_cat' | 'schmoopy' | 'player'
  isDead?: boolean;
  className?: string;
}

const renderAvatarSvg = (id: string) => {
  switch (id) {
    case 'sharky':
      return (
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
      );

    case 'bacon_cat':
      return (
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
      );

    case 'schmoopy':
      return (
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
      );

    case 'player':
    default:
      return (
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
      );
  }
};

export const AvatarIcon: React.FC<AvatarProps> = ({ id, isDead = false, className = 'w-16 h-16' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div
        className={`w-full h-full rounded-full overflow-hidden border-[3px] ${
          isDead ? 'border-cyan-500/40 bg-stone-950' : 'border-stone-900 shadow-lg'
        } flex items-center justify-center relative`}
      >
        <div className={`w-full h-full ${isDead ? 'opacity-40 grayscale contrast-125' : ''}`}>
          {renderAvatarSvg(id)}
        </div>
        {isDead && (
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center pointer-events-none z-10"
            style={{
              background:
                'radial-gradient(circle at center, rgba(186, 230, 253, 0.65) 0%, rgba(56, 189, 248, 0.38) 45%, rgba(15, 23, 42, 0.88) 100%)',
              boxShadow: '0 0 12px rgba(56, 189, 248, 0.75), inset 0 0 10px rgba(186, 230, 253, 0.8)',
              border: '2px solid rgba(186, 230, 253, 0.65)',
            }}
          >
            <span
              className="select-none"
              style={{
                fontSize: '1.3rem',
                filter: 'drop-shadow(0 0 8px rgba(165, 243, 252, 0.95))',
              }}
            >
              👻
            </span>
          </div>
        )}
      </div>

      {isDead && (
        <div
          className="absolute -bottom-1 -right-1 z-20 bg-stone-900 border-[1.5px] border-stone-600 text-stone-200 rounded-md px-1 py-0.5 flex items-center gap-1 shadow-lg font-bangers text-[9px] tracking-wide pointer-events-none"
          title="R.I.P. Eliminated"
        >
          <svg viewBox="0 0 24 28" className="w-2.5 h-3 text-stone-300 flex-shrink-0" fill="currentColor">
            <path d="M4 26h16v-14c0-4.42-3.58-8-8-8s-8 3.58-8 8v14z" fill="#44403c" stroke="#a8a29e" strokeWidth="1.5" />
            <path d="M12 7v7M9.5 10h5" stroke="#e7e5e4" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="2" y="24" width="20" height="3" rx="1" fill="#292524" stroke="#78716c" strokeWidth="1" />
          </svg>
          <span>R.I.P</span>
        </div>
      )}
    </div>
  );
};
