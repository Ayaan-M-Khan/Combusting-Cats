import React from 'react';

export interface CardArtProps {
  iconName: string;
  className?: string;
}

export const CardArt: React.FC<CardArtProps> = ({ iconName, className = 'w-24 h-24' }) => {
  switch (iconName) {
    case 'bomb': // Exploding Kitten
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="56" r="32" fill="#dc2626" stroke="#1f2937" strokeWidth="4" />
          {/* Kitten ears */}
          <polygon points="30,30 40,46 22,46" fill="#dc2626" stroke="#1f2937" strokeWidth="3" />
          <polygon points="70,30 78,46 60,46" fill="#dc2626" stroke="#1f2937" strokeWidth="3" />
          {/* Burning fuse */}
          <path d="M50 24 Q55 12 68 14" fill="none" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
          {/* Spark */}
          <polygon points="68,14 74,9 72,16 78,14 73,19 78,22 70,21" fill="#facc15" stroke="#ea580c" strokeWidth="1" />
          {/* Wicked glowing eyes */}
          <ellipse cx="40" cy="52" rx="4" ry="7" fill="#ffffff" />
          <ellipse cx="40" cy="52" rx="2" ry="5" fill="#18181b" />
          <ellipse cx="60" cy="52" rx="4" ry="7" fill="#ffffff" />
          <ellipse cx="60" cy="52" rx="2" ry="5" fill="#18181b" />
          {/* Fang smile */}
          <path d="M42 66 Q50 74 58 66" fill="none" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
          <polygon points="45,66 48,70 51,66" fill="#ffffff" />
          <polygon points="51,66 54,70 57,66" fill="#ffffff" />
        </svg>
      );

    case 'laser': // Defuse Laser
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {/* Laser pointer cylinder */}
          <rect x="15" y="44" width="34" height="12" rx="4" transform="rotate(-30 32 50)" fill="#4b5563" stroke="#1f2937" strokeWidth="3" />
          <rect x="42" y="30" width="8" height="6" rx="2" transform="rotate(-30 46 33)" fill="#e5e7eb" stroke="#1f2937" strokeWidth="2" />
          {/* Button */}
          <circle cx="28" cy="48" r="3" fill="#ef4444" />
          {/* Laser beam */}
          <line x1="50" y1="28" x2="88" y2="76" stroke="#ef4444" strokeWidth="3" strokeDasharray="4 2" />
          {/* Dot splash */}
          <circle cx="88" cy="76" r="6" fill="#ef4444" opacity="0.9" />
          <circle cx="88" cy="76" r="10" fill="#fca5a5" opacity="0.4" />
          {/* Playful paws reaching */}
          <circle cx="78" cy="78" r="8" fill="#f97316" stroke="#1f2937" strokeWidth="2" />
          <circle cx="74" cy="72" r="3" fill="#fed7aa" />
          <circle cx="78" cy="70" r="3" fill="#fed7aa" />
          <circle cx="82" cy="72" r="3" fill="#fed7aa" />
        </svg>
      );

    case 'banjo': // Defuse Banjo
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {/* Banjo body */}
          <circle cx="45" cy="62" r="22" fill="#f8fafc" stroke="#1f2937" strokeWidth="4" />
          <circle cx="45" cy="62" r="17" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" strokeDasharray="3 3" />
          {/* Neck */}
          <rect x="42" y="16" width="6" height="32" fill="#b45309" stroke="#1f2937" strokeWidth="2" />
          {/* Headstock */}
          <rect x="40" y="8" width="10" height="10" rx="2" fill="#78350f" stroke="#1f2937" strokeWidth="2" />
          {/* Strings */}
          <line x1="43" y1="14" x2="43" y2="70" stroke="#94a3b8" strokeWidth="1" />
          <line x1="45" y1="14" x2="45" y2="70" stroke="#94a3b8" strokeWidth="1" />
          <line x1="47" y1="14" x2="47" y2="70" stroke="#94a3b8" strokeWidth="1" />
          {/* Musical notes */}
          <path d="M72 30 L82 24 L82 36 M72 30 L72 40" stroke="#3b82f6" strokeWidth="2" fill="none" />
          <circle cx="70" cy="40" r="3" fill="#3b82f6" />
          <circle cx="80" cy="36" r="3" fill="#3b82f6" />
        </svg>
      );

    case 'sandwich': // Defuse Sandwich
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {/* Top bread */}
          <ellipse cx="50" cy="36" rx="34" ry="12" fill="#d97706" stroke="#1f2937" strokeWidth="3" />
          {/* Lettuce */}
          <path d="M20 44 Q35 48 50 44 Q65 48 80 44" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" />
          {/* Cheese */}
          <polygon points="30,48 54,56 70,48" fill="#eab308" />
          {/* Kitty inside */}
          <circle cx="50" cy="48" r="8" fill="#ec4899" />
          <ellipse cx="47" cy="46" rx="1.5" ry="2" fill="#18181b" />
          <ellipse cx="53" cy="46" rx="1.5" ry="2" fill="#18181b" />
          {/* Bottom bread */}
          <ellipse cx="50" cy="62" rx="34" ry="12" fill="#b45309" stroke="#1f2937" strokeWidth="3" />
        </svg>
      );

    case 'paw': // Attack Single Slap
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {/* Tiger paw pad */}
          <ellipse cx="50" cy="62" rx="22" ry="18" fill="#ea580c" stroke="#1f2937" strokeWidth="3" />
          {/* Toe beans */}
          <ellipse cx="30" cy="38" rx="8" ry="10" fill="#ea580c" stroke="#1f2937" strokeWidth="3" />
          <ellipse cx="44" cy="32" rx="8" ry="11" fill="#ea580c" stroke="#1f2937" strokeWidth="3" />
          <ellipse cx="58" cy="32" rx="8" ry="11" fill="#ea580c" stroke="#1f2937" strokeWidth="3" />
          <ellipse cx="72" cy="38" rx="8" ry="10" fill="#ea580c" stroke="#1f2937" strokeWidth="3" />
          {/* Claws */}
          <path d="M28 26 Q30 18 36 22" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M43 20 Q45 12 51 16" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M57 20 Q59 12 65 16" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M72 26 Q74 18 80 22" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Whoosh impact lines */}
          <path d="M12 45 Q16 65 24 82" stroke="#f97316" strokeWidth="3" fill="none" strokeDasharray="3 3" />
          <path d="M84 45 Q80 65 74 80" stroke="#f97316" strokeWidth="3" fill="none" strokeDasharray="3 3" />
        </svg>
      );

    case 'claws': // Attack Double Slap
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {/* Bear claw swipe */}
          <path d="M20 20 Q50 60 70 85" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
          <path d="M35 15 Q65 55 85 80" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
          <path d="M50 12 Q80 50 95 72" stroke="#f97316" strokeWidth="5" strokeLinecap="round" />
          {/* Sparkles */}
          <polygon points="60,40 64,32 68,40 76,44 68,48 64,56 60,48 52,44" fill="#fbbf24" stroke="#1f2937" strokeWidth="2" />
        </svg>
      );

    case 'run': // Skip Sprint
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {/* Speed dust puffs */}
          <circle cx="20" cy="65" r="8" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
          <circle cx="14" cy="55" r="5" fill="#e2e8f0" />
          <circle cx="28" cy="72" r="6" fill="#cbd5e1" />
          {/* Running feline stick figure */}
          <ellipse cx="60" cy="50" rx="18" ry="10" transform="rotate(-15 60 50)" fill="#3b82f6" stroke="#1f2937" strokeWidth="3" />
          <circle cx="76" cy="42" r="10" fill="#3b82f6" stroke="#1f2937" strokeWidth="3" />
          {/* Ears */}
          <polygon points="76,32 82,38 72,36" fill="#3b82f6" stroke="#1f2937" strokeWidth="2" />
          <polygon points="82,34 88,40 80,38" fill="#3b82f6" stroke="#1f2937" strokeWidth="2" />
          {/* Wind streak lines */}
          <line x1="10" y1="36" x2="35" y2="36" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          <line x1="18" y1="44" x2="42" y2="44" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'rabbit': // Skip Rabbit hole
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {/* Hole */}
          <ellipse cx="50" cy="70" rx="36" ry="14" fill="#1c1917" stroke="#44403c" strokeWidth="3" />
          {/* Cat tail & back feet sticking out */}
          <ellipse cx="44" cy="52" rx="7" ry="16" transform="rotate(-20 44 52)" fill="#3b82f6" stroke="#1f2937" strokeWidth="3" />
          <ellipse cx="58" cy="54" rx="7" ry="16" transform="rotate(25 58 54)" fill="#3b82f6" stroke="#1f2937" strokeWidth="3" />
          {/* Twitched tail */}
          <path d="M50 56 Q52 35 64 30" fill="none" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" />
        </svg>
      );

    case 'eye': // See Future Crystal Ball
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {/* Base */}
          <path d="M30 84 L70 84 L64 74 L36 74 Z" fill="#b45309" stroke="#1f2937" strokeWidth="3" />
          {/* Crystal Ball */}
          <circle cx="50" cy="46" r="28" fill="#a855f7" stroke="#1f2937" strokeWidth="4" />
          <circle cx="50" cy="46" r="24" fill="#c084fc" opacity="0.8" />
          {/* Mystic glowing eye inside */}
          <ellipse cx="50" cy="46" rx="14" ry="9" fill="#ffffff" stroke="#581c87" strokeWidth="2" />
          <circle cx="50" cy="46" r="5" fill="#581c87" />
          <circle cx="52" cy="44" r="1.5" fill="#ffffff" />
          {/* Magic glints */}
          <polygon points="32,28 34,22 36,28 42,30 36,32 34,38 32,32 26,30" fill="#fef08a" />
          <polygon points="72,22 74,18 76,22 80,24 76,26 74,30 72,26 68,24" fill="#fef08a" />
        </svg>
      );

    case 'binoculars': // Recon Sloth
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {/* Binoculars */}
          <rect x="24" y="44" width="22" height="30" rx="6" fill="#475569" stroke="#1f2937" strokeWidth="3" />
          <rect x="54" y="44" width="22" height="30" rx="6" fill="#475569" stroke="#1f2937" strokeWidth="3" />
          <rect x="42" y="52" width="16" height="8" rx="2" fill="#1e293b" stroke="#1f2937" strokeWidth="2" />
          {/* Lenses */}
          <ellipse cx="35" cy="72" rx="9" ry="4" fill="#38bdf8" />
          <ellipse cx="65" cy="72" rx="9" ry="4" fill="#38bdf8" />
          {/* Sloth arms holding */}
          <circle cx="18" cy="54" r="8" fill="#a16207" stroke="#1f2937" strokeWidth="2" />
          <circle cx="82" cy="54" r="8" fill="#a16207" stroke="#1f2937" strokeWidth="2" />
        </svg>
      );

    case 'vortex': // Alter the future
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {/* Swirling spiral vortex */}
          <circle cx="50" cy="50" r="34" fill="#fae8ff" stroke="#a21caf" strokeWidth="4" />
          <path d="M50 50 A 6 6 0 0 1 56 50 A 12 12 0 0 1 38 50 A 18 18 0 0 1 68 50 A 24 24 0 0 1 26 50 A 30 30 0 0 1 80 50" fill="none" stroke="#c026d3" strokeWidth="4" strokeLinecap="round" />
          {/* Tiny clock floating */}
          <circle cx="68" cy="30" r="8" fill="#ffffff" stroke="#1f2937" strokeWidth="2" />
          <line x1="68" y1="30" x2="68" y2="26" stroke="#1f2937" strokeWidth="2" />
          <line x1="68" y1="30" x2="72" y2="30" stroke="#1f2937" strokeWidth="2" />
        </svg>
      );

    case 'grab': // Favor / Steal
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {/* Sneaky arm extending */}
          <path d="M10 65 Q45 60 70 48" stroke="#0891b2" strokeWidth="16" fill="none" strokeLinecap="round" />
          {/* Grabbing claws wrapping card */}
          <circle cx="76" cy="44" r="10" fill="#06b6d4" stroke="#1f2937" strokeWidth="3" />
          <circle cx="70" cy="36" r="4" fill="#06b6d4" stroke="#1f2937" strokeWidth="2" />
          <circle cx="78" cy="34" r="4" fill="#06b6d4" stroke="#1f2937" strokeWidth="2" />
          <circle cx="84" cy="38" r="4" fill="#06b6d4" stroke="#1f2937" strokeWidth="2" />
          {/* Stolen card */}
          <rect x="74" y="24" width="18" height="26" rx="3" transform="rotate(20 83 37)" fill="#ffffff" stroke="#ef4444" strokeWidth="3" />
        </svg>
      );

    case 'shuffle': // Shuffle tornado
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {/* Swirling arrows */}
          <path d="M30 65 C20 40 40 20 65 24" fill="none" stroke="#57534e" strokeWidth="6" strokeLinecap="round" />
          <polygon points="62,16 76,26 62,34" fill="#57534e" />
          <path d="M70 35 C80 60 60 80 35 76" fill="none" stroke="#78716c" strokeWidth="6" strokeLinecap="round" />
          <polygon points="38,84 24,74 38,66" fill="#78716c" />
          {/* Flying mini cards */}
          <rect x="42" y="44" width="14" height="20" rx="2" transform="rotate(-25 49 54)" fill="#ffffff" stroke="#1f2937" strokeWidth="2" />
          <rect x="48" y="40" width="14" height="20" rx="2" transform="rotate(18 55 50)" fill="#ffffff" stroke="#1f2937" strokeWidth="2" />
        </svg>
      );

    case 'potato': // Hairy Potato Cat
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {/* Hairy potato blob */}
          <ellipse cx="50" cy="54" rx="32" ry="24" fill="#a16207" stroke="#1f2937" strokeWidth="4" />
          {/* Hair strands */}
          <path d="M26 38 L22 30 M38 32 L36 24 M62 32 L66 24 M74 40 L82 32" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
          {/* Silly potato eyes */}
          <circle cx="40" cy="50" r="5" fill="#ffffff" stroke="#1f2937" strokeWidth="2" />
          <circle cx="40" cy="50" r="2" fill="#18181b" />
          <circle cx="60" cy="50" r="5" fill="#ffffff" stroke="#1f2937" strokeWidth="2" />
          <circle cx="60" cy="50" r="2" fill="#18181b" />
          {/* Cute derp mouth */}
          <path d="M48 58 Q50 62 52 58" stroke="#1f2937" strokeWidth="2" fill="none" />
        </svg>
      );

    case 'taco': // Tacocat
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {/* Taco shell */}
          <path d="M16 66 C18 36 82 36 84 66 Z" fill="#eab308" stroke="#1f2937" strokeWidth="4" />
          {/* Taco filling */}
          <path d="M24 62 Q50 48 76 62" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" />
          <circle cx="40" cy="56" r="3" fill="#dc2626" />
          <circle cx="60" cy="56" r="3" fill="#dc2626" />
          {/* Cat ears on top of taco */}
          <polygon points="34,38 42,24 46,38" fill="#eab308" stroke="#1f2937" strokeWidth="2" />
          <polygon points="54,38 58,24 66,38" fill="#eab308" stroke="#1f2937" strokeWidth="2" />
          {/* Cat face */}
          <circle cx="44" cy="46" r="2" fill="#18181b" />
          <circle cx="56" cy="46" r="2" fill="#18181b" />
          <path d="M47 50 Q50 53 53 50" stroke="#1f2937" strokeWidth="1.5" fill="none" />
        </svg>
      );

    case 'rainbow': // Rainbow-Ralphing Cat
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {/* Cat head */}
          <ellipse cx="36" cy="40" rx="18" ry="16" fill="#f472b6" stroke="#1f2937" strokeWidth="3" />
          <polygon points="24,28 28,18 36,26" fill="#f472b6" stroke="#1f2937" strokeWidth="2" />
          <polygon points="40,26 48,18 50,28" fill="#f472b6" stroke="#1f2937" strokeWidth="2" />
          {/* Hypnotized spiral eyes */}
          <circle cx="30" cy="38" r="3" fill="#ffffff" stroke="#1f2937" strokeWidth="1" />
          <circle cx="40" cy="38" r="3" fill="#ffffff" stroke="#1f2937" strokeWidth="1" />
          {/* Ralphing wide open mouth */}
          <ellipse cx="48" cy="48" rx="8" ry="10" fill="#831843" stroke="#1f2937" strokeWidth="2" />
          {/* Rainbow arc streaming out */}
          <path d="M52 48 Q70 52 88 80" stroke="#ef4444" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M52 52 Q70 56 86 84" stroke="#f59e0b" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M52 56 Q70 60 84 88" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M52 60 Q70 64 82 92" stroke="#3b82f6" strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'beard': // Beard Cat
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {/* Cat face */}
          <circle cx="50" cy="44" r="22" fill="#f59e0b" stroke="#1f2937" strokeWidth="3" />
          {/* Cat ears */}
          <polygon points="34,26 38,12 48,24" fill="#f59e0b" stroke="#1f2937" strokeWidth="2" />
          <polygon points="52,24 62,12 66,26" fill="#f59e0b" stroke="#1f2937" strokeWidth="2" />
          {/* Serious eyes */}
          <line x1="38" y1="40" x2="45" y2="42" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="55" y1="42" x2="62" y2="40" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
          {/* Massive beard */}
          <path d="M32 50 C30 75 42 88 50 88 C58 88 70 75 68 50 Z" fill="#78350f" stroke="#1f2937" strokeWidth="3" />
          <path d="M42 56 Q50 62 58 56" stroke="#451a03" strokeWidth="2" fill="none" />
        </svg>
      );

    case 'melon': // Cattermelon
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {/* Watermelon rind slice */}
          <path d="M18 52 C24 82 76 82 82 52 Z" fill="#15803d" stroke="#1f2937" strokeWidth="4" />
          <path d="M22 52 C26 78 74 78 78 52 Z" fill="#ef4444" stroke="#1f2937" strokeWidth="2" />
          {/* Cat ears on watermelon */}
          <polygon points="26,52 32,38 42,50" fill="#15803d" stroke="#1f2937" strokeWidth="2" />
          <polygon points="58,50 68,38 74,52" fill="#15803d" stroke="#1f2937" strokeWidth="2" />
          {/* Seeds / eyes */}
          <ellipse cx="40" cy="62" rx="2" ry="4" fill="#18181b" />
          <ellipse cx="60" cy="62" rx="2" ry="4" fill="#18181b" />
          <ellipse cx="50" cy="70" rx="2" ry="3" fill="#18181b" />
        </svg>
      );

    default:
      return (
        <div className={`flex items-center justify-center bg-amber-100 rounded-lg font-bangers text-amber-800 ${className}`}>
          MEOW
        </div>
      );
  }
};

/**
 * Signature Red Silhouette Kitten (used for card backs, draw deck, title screen)
 */
export const KittenSilhouette: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => {
  return (
    <svg viewBox="0 0 120 100" className={className}>
      <path
        d="M20 75 C10 65 14 45 28 45 C32 45 35 30 44 26 C46 32 48 36 54 36 C64 34 82 34 90 42 C98 34 102 26 106 28 C108 34 104 44 106 48 C116 54 116 75 102 78 C92 80 84 80 60 80 C36 80 26 80 20 75 Z"
        fill="currentColor"
      />
      {/* Eyes */}
      <circle cx="68" cy="46" r="3.5" fill="#fef08a" />
      <circle cx="86" cy="46" r="3.5" fill="#fef08a" />
      {/* Tail curl */}
      <path
        d="M24 66 C14 62 8 72 14 82 C18 88 28 88 32 82"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
};
