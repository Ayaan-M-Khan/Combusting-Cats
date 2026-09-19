import React from 'react';
import { Card, Player } from '../types';
import { CardView } from './CardView';
import { AvatarIcon } from './Avatars';

interface PlayerHandProps {
  player: Player;
  isHumanTurn: boolean;
  selectedCards: Card[];
  onSelectCard: (card: Card) => void;
  onPlaySelected: () => void;
  turnsRemaining: number;
}

export const PlayerHand: React.FC<PlayerHandProps> = ({
  player,
  isHumanTurn,
  selectedCards,
  onSelectCard,
  onPlaySelected,
  turnsRemaining,
}) => {
  const isSelected = (card: Card) => selectedCards.some((c) => c.id === card.id);

  // Check if current selection is a valid play:
  // 1 single card (if not a cat card needing a pair) OR 2 identical cat cards
  const canPlay = () => {
    if (!isHumanTurn) return false;
    if (selectedCards.length === 1) {
      const card = selectedCards[0];
      // Cat cards require 2 to play a steal combo
      if (card.category === 'cat') return false;
      // Exploding Kitten cannot be manually played from hand
      if (card.type === 'EXPLODING_KITTEN') return false;
      // Defuse card cannot be played on its own (only automatically when drawing kitten)
      if (card.type === 'DEFUSE') return false;
      return true;
    }
    if (selectedCards.length === 2) {
      const [c1, c2] = selectedCards;
      return c1.category === 'cat' && c2.category === 'cat' && c1.type === c2.type;
    }
    return false;
  };

  const getPlayButtonText = () => {
    if (selectedCards.length === 2 && selectedCards[0].category === 'cat') {
      return 'PLAY CAT PAIR (STEAL 1 CARD)';
    }
    if (selectedCards.length === 1) {
      return `PLAY ${selectedCards[0].title}`;
    }
    return 'PLAY CARD';
  };

  return (
    <div className="w-full relative z-20 flex flex-col items-center">
      {/* Action / Hint Bar above hand */}
      <div className="flex items-center gap-3 mb-2">
        {selectedCards.length > 0 && canPlay() && (
          <button
            onClick={onPlaySelected}
            className="px-6 py-2 rounded-xl bg-gradient-to-b from-yellow-400 to-amber-500 border-3 border-stone-900 font-bangers text-stone-950 text-base sm:text-lg tracking-wider shadow-[0_4px_0_#000] hover:scale-105 active:translate-y-1 transition-all cursor-pointer animate-pulse"
          >
            {getPlayButtonText()}
          </button>
        )}

        {selectedCards.length === 1 && selectedCards[0].category === 'cat' && (
          <div className="bg-amber-100 border-2 border-amber-800 text-amber-950 px-3 py-1 rounded-full font-comic text-xs font-bold shadow">
            Select a 2nd matching {selectedCards[0].title} to steal a card!
          </div>
        )}

        {isHumanTurn && selectedCards.length === 0 && (
          <div className="bg-black/60 backdrop-blur-xs text-amber-200 border border-amber-500/40 px-3 py-1 rounded-full font-bangers text-xs sm:text-sm tracking-wider shadow">
            YOUR TURN • PLAY AN ACTION CARD OR DRAW FROM THE DECK
            {turnsRemaining > 1 ? ` (${turnsRemaining} TURNS TO TAKE)` : ''}
          </div>
        )}
      </div>

      {/* Main Bottom Container: Avatar on left + Card Tray */}
      <div className="w-full flex items-end justify-start sm:justify-center px-4 overflow-x-auto pb-4 pt-8 scrollbar-none">
        {/* Player Identity Tag (bottom left) */}
        <div className="flex-shrink-0 flex items-center gap-2 bg-[#2d1b10]/90 border-3 border-[#1c0f08] px-3 py-1.5 rounded-2xl shadow-xl mr-3 mb-2">
          <div className="relative">
            <AvatarIcon
              id="player"
              isDead={player.isDead}
              className="w-12 h-12 sm:w-14 sm:h-14"
            />
            {isHumanTurn && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-black" />
              </span>
            )}
          </div>
          <div>
            <div className="font-bangers text-white text-base sm:text-lg tracking-wide leading-tight">
              {player.name}
            </div>
            <div className="text-[11px] font-comic font-bold text-amber-300">
              {player.hand.length} CARDS
            </div>
          </div>
        </div>

        {/* Fanned / Lined up Cards Tray */}
        <div className="flex items-end -space-x-8 sm:-space-x-10 hover:space-x-1 transition-all duration-300 px-2 py-4">
          {player.hand.map((card) => {
            const selected = isSelected(card);
            const isDefuse = card.type === 'DEFUSE';
            const isExploding = card.type === 'EXPLODING_KITTEN';
            const isPlayable = isHumanTurn && !isDefuse && !isExploding;

            return (
              <div
                key={card.id}
                className="transform transition-transform duration-200"
              >
                <CardView
                  card={card}
                  selected={selected}
                  isPlayable={isPlayable}
                  onClick={() => onSelectCard(card)}
                  size="compact"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
