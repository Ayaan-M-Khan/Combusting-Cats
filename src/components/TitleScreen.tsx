import React from 'react';
import { KittenSilhouette } from './CardArt';

interface TitleScreenProps {
  onStartGame: () => void;
  onOpenTutorial: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenTutorial,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <div className="w-full h-screen bg-[#651010] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background radial gradient with subtle cat paws pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#991b1b_0%,_#450a0a_100%)] opacity-95" />

      {/* Decorative background kitten outlines */}
      <div className="absolute -top-12 -left-12 opacity-10 text-white pointer-events-none">
        <KittenSilhouette className="w-80 h-80" />
      </div>
      <div className="absolute -bottom-16 -right-16 opacity-10 text-white pointer-events-none">
        <KittenSilhouette className="w-96 h-96" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 max-w-5xl w-full">
        {/* Left: Huge Logo & Glowing Kitten */}
        <div className="flex flex-col items-center text-center">
          <div className="flex flex-col items-center">
            <span className="font-bangers text-5xl sm:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 tracking-wider drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
              EXPLODING
            </span>
            <span className="font-bangers text-6xl sm:text-8xl lg:text-9xl text-white tracking-widest leading-none drop-shadow-[0_6px_10px_rgba(0,0,0,0.9)] -mt-2 sm:-mt-4">
              KITTENS
            </span>
          </div>

          <div className="mt-4 sm:mt-6 text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.6)] transform hover:scale-105 transition-transform duration-300 cursor-pointer">
            <KittenSilhouette className="w-40 h-40 sm:w-56 sm:h-56" />
          </div>
        </div>

        {/* Right: Comic Wooden Menu Buttons (matches screenshot #2) */}
        <div className="flex flex-col gap-4 w-full max-w-sm sm:max-w-md">
          {/* PLAY GAME BUTTON */}
          <button
            onClick={onStartGame}
            className="group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#992d19] to-[#7f1d1d] border-4 border-stone-950 shadow-[0_8px_0_#1c0f08] hover:shadow-[0_4px_0_#1c0f08] hover:translate-y-1 active:translate-y-2 transition-all cursor-pointer overflow-hidden"
          >
            {/* Left mini icon badge */}
            <div className="w-12 h-12 rounded-xl bg-[#591616] border-2 border-stone-900 flex items-center justify-center text-2xl shadow-inner">
              🎮
            </div>

            {/* Middle Title & Subtitle */}
            <div className="flex-1 px-4 text-left">
              <div className="font-bangers text-2xl sm:text-3xl text-white tracking-wide leading-tight group-hover:text-yellow-300 transition-colors">
                PLAY GAME
              </div>
              <div className="font-bangers text-xs sm:text-sm text-amber-200 tracking-wide">
                4 PLAYERS (YOU + 3 SMART BOTS)
              </div>
            </div>

            {/* Right Green Arrow Pill */}
            <div className="w-10 h-10 rounded-xl bg-lime-500 border-2 border-stone-900 flex items-center justify-center shadow-md group-hover:bg-lime-400 group-hover:translate-x-1 transition-all">
              <svg className="w-6 h-6 text-stone-900 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* TUTORIAL / LEARN THE ROPES */}
          <button
            onClick={onOpenTutorial}
            className="group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#852516] to-[#6b1818] border-4 border-stone-950 shadow-[0_8px_0_#1c0f08] hover:shadow-[0_4px_0_#1c0f08] hover:translate-y-1 active:translate-y-2 transition-all cursor-pointer overflow-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-[#4a1212] border-2 border-stone-900 flex items-center justify-center text-2xl shadow-inner text-amber-300 font-bangers">
              ?
            </div>
            <div className="flex-1 px-4 text-left">
              <div className="font-bangers text-2xl sm:text-3xl text-white tracking-wide leading-tight group-hover:text-yellow-300 transition-colors">
                TUTORIAL
              </div>
              <div className="font-bangers text-xs sm:text-sm text-amber-200 tracking-wide">
                LEARN THE ROPES & RULES
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-lime-500 border-2 border-stone-900 flex items-center justify-center shadow-md group-hover:bg-lime-400 group-hover:translate-x-1 transition-all">
              <svg className="w-6 h-6 text-stone-900 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* AUDIO SFX TOGGLE BUTTON */}
          <button
            onClick={onToggleSound}
            className="flex items-center justify-center gap-3 p-3 rounded-xl bg-stone-900/60 border-2 border-stone-800 text-amber-200 font-bangers text-sm sm:text-base tracking-wider hover:bg-stone-900/80 transition-all cursor-pointer"
          >
            <span>{soundEnabled ? '🔊 SOUND EFFECTS: ON' : '🔇 SOUND EFFECTS: MUTED'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
