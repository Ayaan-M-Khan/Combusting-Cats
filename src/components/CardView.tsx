import React from 'react';
import { Card } from '../types';
import { CardArt } from './CardArt';

interface CardViewProps {
  card: Card;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  isPlayable?: boolean;
  size?: 'normal' | 'compact' | 'mini';
  className?: string;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  onClick,
  selected = false,
  disabled = false,
  isPlayable = true,
  size = 'normal',
  className = '',
}) => {
  const isCompact = size === 'compact';
  const isMini = size === 'mini';

  return (
    <div
      onClick={!disabled && onClick ? onClick : undefined}
      className={`
        relative rounded-xl border-[2.5px] border-[#1f2937] bg-white shadow-[0_6px_0_rgba(0,0,0,0.35)]
        flex flex-col select-none transition-all duration-200 cursor-pointer overflow-hidden
        ${selected ? 'ring-4 ring-yellow-400 -translate-y-8 shadow-[0_14px_20px_rgba(234,179,8,0.5)] scale-105 z-30' : ''}
        ${!disabled && isPlayable && !selected ? 'hover:-translate-y-6 hover:shadow-[0_12px_18px_rgba(0,0,0,0.4)] hover:z-20' : ''}
        ${disabled ? 'opacity-60 cursor-not-allowed saturate-70' : ''}
        ${isMini ? 'w-24 h-36' : isCompact ? 'w-36 h-52' : 'w-44 h-64 sm:w-48 sm:h-72'}
        ${className}
      `}
      style={{
        backgroundColor: '#ffffff',
      }}
    >
      {/* Top Color Banner */}
      <div
        className="w-full px-2 py-1 flex items-center justify-between border-b-2 border-[#1f2937]"
        style={{ backgroundColor: card.badgeColor }}
      >
        <span className="font-bangers text-white text-xs sm:text-sm tracking-wide drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] truncate">
          {card.type.replace(/_/g, ' ')}
        </span>
        {card.category === 'cat' && (
          <span className="bg-yellow-300 text-black font-bangers text-[10px] px-1 rounded-sm border border-black/40">
            PAIR
          </span>
        )}
      </div>

      {/* Card Header Title */}
      <div className="px-2 pt-1.5 pb-0.5 text-center bg-stone-50">
        <div className="font-bangers text-[#1f2937] text-xs sm:text-sm leading-tight truncate">
          {card.title}
        </div>
        {!isMini && (
          <div className="text-[9px] font-bold text-stone-500 uppercase tracking-tight truncate">
            {card.subTitle}
          </div>
        )}
      </div>

      {/* Center Artwork Canvas */}
      <div
        className="flex-1 flex items-center justify-center p-1.5 relative overflow-hidden"
        style={{ backgroundColor: card.bgTone }}
      >
        <CardArt
          iconName={card.iconName}
          className={isMini ? 'w-14 h-14' : isCompact ? 'w-20 h-20' : 'w-24 h-24 sm:w-28 sm:h-28'}
        />
        {selected && (
          <div className="absolute top-1 right-1 bg-yellow-400 text-stone-900 rounded-full p-1 border border-stone-900 shadow">
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Bottom Action strip */}
      <div className="p-1.5 bg-stone-100 border-t-2 border-[#1f2937] flex flex-col justify-center">
        <div
          className="rounded py-0.5 px-1 text-center font-bangers text-[10px] sm:text-xs text-white truncate shadow-inner"
          style={{ backgroundColor: card.badgeColor }}
        >
          {card.actionText}
        </div>
        {!isMini && !isCompact && (
          <p className="text-[9px] text-stone-600 text-center leading-tight line-clamp-2 mt-1 px-0.5 font-medium">
            {card.flavorText}
          </p>
        )}
      </div>
    </div>
  );
};
