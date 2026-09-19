import React, { useState } from 'react';
import { Card, Player, MatchStats } from '../types';
import { CardView } from './CardView';
import { AvatarIcon } from './Avatars';
import { KittenSilhouette } from './CardArt';

interface DefuseModalProps {
  deckSize: number;
  onPlaceKitten: (position: 'top' | 'random' | 'bottom' | number) => void;
}

export const DefuseModal: React.FC<DefuseModalProps> = ({ deckSize, onPlaceKitten }) => {
  const [exactIndex, setExactIndex] = useState<number>(0);
  const [useSlider, setUseSlider] = useState<boolean>(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-[#2a170d] border-4 border-yellow-500 rounded-3xl max-w-lg w-full p-6 text-center shadow-[0_0_50px_rgba(234,179,8,0.5)] flex flex-col items-center">
        {/* Defuse Badge */}
        <div className="w-16 h-16 rounded-full bg-emerald-500 border-4 border-stone-900 flex items-center justify-center text-white mb-3 shadow-lg">
          <svg className="w-10 h-10" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>

        <h2 className="font-bangers text-3xl sm:text-4xl text-yellow-400 tracking-wide leading-tight">
          KITTEN DEFUSED!
        </h2>
        <p className="font-comic font-medium text-amber-100 text-sm sm:text-base mt-1 max-w-sm">
          Your Defuse card neutralized the bomb! Secretly choose where to insert the Exploding Kitten into the Draw Pile:
        </p>

        {/* 3 Quick Action Presets */}
        <div className="grid grid-cols-3 gap-3 w-full my-6">
          <button
            onClick={() => onPlaceKitten('top')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-red-500 to-red-700 border-3 border-stone-900 text-white font-bangers hover:scale-105 active:translate-y-1 transition-all cursor-pointer shadow-[0_4px_0_#000]"
          >
            <span className="text-xl">🔥</span>
            <span className="text-sm mt-1">TOP OF DECK</span>
            <span className="text-[10px] opacity-80 font-comic font-normal">Next player takes it!</span>
          </button>

          <button
            onClick={() => onPlaceKitten('random')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-amber-500 to-amber-700 border-3 border-stone-900 text-white font-bangers hover:scale-105 active:translate-y-1 transition-all cursor-pointer shadow-[0_4px_0_#000]"
          >
            <span className="text-xl">🎲</span>
            <span className="text-sm mt-1">RANDOM SPOT</span>
            <span className="text-[10px] opacity-80 font-comic font-normal">Secret shuffle</span>
          </button>

          <button
            onClick={() => onPlaceKitten('bottom')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-blue-500 to-blue-700 border-3 border-stone-900 text-white font-bangers hover:scale-105 active:translate-y-1 transition-all cursor-pointer shadow-[0_4px_0_#000]"
          >
            <span className="text-xl">🛡️</span>
            <span className="text-sm mt-1">BOTTOM</span>
            <span className="text-[10px] opacity-80 font-comic font-normal">Safest for now</span>
          </button>
        </div>

        {/* Optional Custom Slider Toggle */}
        <div className="w-full flex flex-col items-center border-t border-amber-900/60 pt-4">
          <button
            onClick={() => setUseSlider(!useSlider)}
            className="text-xs font-comic font-bold text-amber-300 underline cursor-pointer hover:text-white"
          >
            {useSlider ? 'Hide Custom Depth' : 'Or choose exact depth with slider...'}
          </button>

          {useSlider && (
            <div className="w-full mt-4 flex flex-col items-center">
              <div className="flex justify-between w-full text-xs font-bangers text-amber-200 mb-1">
                <span>Top (Card #1)</span>
                <span>Card #{exactIndex + 1}</span>
                <span>Bottom (Card #{deckSize + 1})</span>
              </div>
              <input
                type="range"
                min="0"
                max={deckSize}
                value={exactIndex}
                onChange={(e) => setExactIndex(Number(e.target.value))}
                className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
              />
              <button
                onClick={() => onPlaceKitten(exactIndex)}
                className="mt-4 px-6 py-2 rounded-xl bg-yellow-400 border-2 border-stone-900 font-bangers text-stone-950 text-sm hover:scale-105 cursor-pointer shadow"
              >
                PLACE AT CARD #{exactIndex + 1}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface SeeFutureModalProps {
  cards: Card[];
  onClose: () => void;
}

export const SeeFutureModal: React.FC<SeeFutureModalProps> = ({ cards, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-[#24130b] border-4 border-purple-500 rounded-3xl max-w-2xl w-full p-6 text-center shadow-[0_0_50px_rgba(168,85,247,0.5)] flex flex-col items-center">
        <h2 className="font-bangers text-3xl sm:text-4xl text-purple-300 tracking-wide">
          SEE THE FUTURE (TOP 3 CARDS)
        </h2>
        <p className="font-comic text-purple-200 text-xs sm:text-sm mt-1">
          Top card is on the left (the very next card to be drawn):
        </p>

        {/* Display Cards */}
        <div className="flex flex-wrap items-center justify-center gap-4 my-6">
          {cards.map((card, idx) => (
            <div key={card.id} className="flex flex-col items-center">
              <span className="font-bangers text-xs text-purple-300 mb-1">
                {idx === 0 ? '1ST (NEXT DRAW)' : idx === 1 ? '2ND CARD' : '3RD CARD'}
              </span>
              <CardView card={card} disabled isPlayable={false} size="compact" />
            </div>
          ))}
          {cards.length === 0 && (
            <div className="text-white font-bangers">No cards remaining in deck!</div>
          )}
        </div>

        <button
          onClick={onClose}
          className="px-8 py-2.5 rounded-xl bg-gradient-to-b from-purple-400 to-purple-600 border-3 border-stone-900 font-bangers text-white text-lg tracking-wider hover:scale-105 active:translate-y-1 transition-all cursor-pointer shadow-[0_4px_0_#000]"
        >
          GOT IT / CLOSE
        </button>
      </div>
    </div>
  );
};

interface AlterFutureModalProps {
  initialCards: Card[];
  onConfirm: (reorderedCards: Card[]) => void;
}

export const AlterFutureModal: React.FC<AlterFutureModalProps> = ({ initialCards, onConfirm }) => {
  const [cards, setCards] = useState<Card[]>(initialCards);

  const swap = (idx1: number, idx2: number) => {
    if (idx1 < 0 || idx2 < 0 || idx1 >= cards.length || idx2 >= cards.length) return;
    const next = [...cards];
    [next[idx1], next[idx2]] = [next[idx2], next[idx1]];
    setCards(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-[#24130b] border-4 border-fuchsia-500 rounded-3xl max-w-3xl w-full p-6 text-center shadow-[0_0_50px_rgba(217,70,239,0.5)] flex flex-col items-center">
        <h2 className="font-bangers text-3xl sm:text-4xl text-fuchsia-300 tracking-wide">
          ALTER THE FUTURE
        </h2>
        <p className="font-comic text-fuchsia-200 text-xs sm:text-sm mt-1">
          Rearrange the top cards. The card in position #1 will be drawn next:
        </p>

        {/* Display cards with swap controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 my-6">
          {cards.map((card, idx) => (
            <div key={card.id} className="flex flex-col items-center">
              <span className="font-bangers text-xs text-fuchsia-300 mb-1">
                POSITION #{idx + 1} {idx === 0 ? '(DRAWS FIRST)' : ''}
              </span>
              <CardView card={card} disabled isPlayable={false} size="compact" />
              <div className="flex gap-2 mt-2">
                <button
                  disabled={idx === 0}
                  onClick={() => swap(idx, idx - 1)}
                  className="px-2 py-1 bg-stone-700 disabled:opacity-30 text-white rounded font-bangers text-xs cursor-pointer border border-stone-900"
                >
                  ◀ MOVE LEFT
                </button>
                <button
                  disabled={idx === cards.length - 1}
                  onClick={() => swap(idx, idx + 1)}
                  className="px-2 py-1 bg-stone-700 disabled:opacity-30 text-white rounded font-bangers text-xs cursor-pointer border border-stone-900"
                >
                  MOVE RIGHT ▶
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => onConfirm(cards)}
          className="px-8 py-2.5 rounded-xl bg-gradient-to-b from-fuchsia-500 to-fuchsia-700 border-3 border-stone-900 font-bangers text-white text-lg tracking-wider hover:scale-105 active:translate-y-1 transition-all cursor-pointer shadow-[0_4px_0_#000]"
        >
          CONFIRM REORDER & PLACE BACK
        </button>
      </div>
    </div>
  );
};

interface TargetSelectModalProps {
  title: string;
  subtitle: string;
  opponents: Player[];
  onSelect: (targetId: string) => void;
  onCancel?: () => void;
}

export const TargetSelectModal: React.FC<TargetSelectModalProps> = ({
  title,
  subtitle,
  opponents,
  onSelect,
  onCancel,
}) => {
  const aliveOpponents = opponents.filter((o) => !o.isDead && o.hand.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-[#24130b] border-4 border-cyan-500 rounded-3xl max-w-lg w-full p-6 text-center shadow-[0_0_50px_rgba(6,182,212,0.5)] flex flex-col items-center">
        <h2 className="font-bangers text-3xl sm:text-4xl text-cyan-300 tracking-wide">
          {title}
        </h2>
        <p className="font-comic text-cyan-100 text-xs sm:text-sm mt-1">{subtitle}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full my-6">
          {aliveOpponents.map((opp) => (
            <button
              key={opp.id}
              onClick={() => onSelect(opp.id)}
              className="flex flex-col items-center p-4 rounded-2xl bg-[#3b2214] border-3 border-stone-900 hover:border-cyan-400 hover:scale-105 active:translate-y-1 transition-all cursor-pointer shadow-[0_4px_0_#000]"
            >
              <AvatarIcon id={opp.avatarId} className="w-16 h-16 mb-2" />
              <span className="font-bangers text-white text-base">{opp.name}</span>
              <span className="text-xs font-comic font-bold text-amber-300 mt-1">
                {opp.hand.length} Cards in Hand
              </span>
            </button>
          ))}
          {aliveOpponents.length === 0 && (
            <div className="col-span-3 text-stone-400 font-bangers text-lg">
              No opponents hold any cards!
            </div>
          )}
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="text-xs font-comic font-bold text-stone-400 underline hover:text-white cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

interface FavorGiveModalProps {
  requesterName: string;
  cards: Card[];
  onGiveCard: (card: Card) => void;
}

export const FavorGiveModal: React.FC<FavorGiveModalProps> = ({
  requesterName,
  cards,
  onGiveCard,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-[#24130b] border-4 border-cyan-400 rounded-3xl max-w-2xl w-full p-6 text-center shadow-[0_0_50px_rgba(6,182,212,0.5)] flex flex-col items-center">
        <h2 className="font-bangers text-3xl sm:text-4xl text-cyan-300 tracking-wide">
          FAVOR DEMANDED!
        </h2>
        <p className="font-comic text-cyan-100 text-xs sm:text-sm mt-1">
          <strong className="text-yellow-400">{requesterName}</strong> played a Favor! Click 1 card from your hand to surrender to them:
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 my-6 max-h-80 overflow-y-auto p-2">
          {cards.map((c) => (
            <div key={c.id} onClick={() => onGiveCard(c)} className="cursor-pointer hover:scale-105 transition-transform">
              <CardView card={c} size="compact" isPlayable={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface GameOverModalProps {
  stats: MatchStats;
  onPlayAgain: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ stats, onPlayAgain }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in zoom-in-95">
      <div className="bg-[#28150c] border-4 border-yellow-500 rounded-3xl max-w-lg w-full p-6 text-center shadow-[0_0_60px_rgba(234,179,8,0.6)] flex flex-col items-center relative overflow-hidden">
        {/* Banner */}
        <div className="mb-4">
          {stats.isHumanWinner ? (
            <div className="inline-block p-4 rounded-full bg-emerald-500 border-4 border-stone-900 shadow-xl text-4xl animate-bounce">
              👑
            </div>
          ) : (
            <div className="inline-block p-4 rounded-full bg-red-600 border-4 border-stone-900 shadow-xl text-4xl animate-pulse">
              💥
            </div>
          )}
        </div>

        <h1 className="font-bangers text-4xl sm:text-5xl text-yellow-400 tracking-wider">
          {stats.isHumanWinner ? 'VICTORY! YOU SURVIVED!' : 'BOOM! YOU WERE ELIMINATED!'}
        </h1>
        <p className="font-comic font-medium text-amber-200 text-sm mt-1">
          {stats.isHumanWinner
            ? 'All other victims perished in fiery feline explosions. You are the ultimate survivor!'
            : `Winner: ${stats.winnerName} stayed cool and outlived the tabletop.`}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 w-full my-6 bg-[#1a0e08] p-4 rounded-2xl border-2 border-amber-900">
          <div className="flex flex-col">
            <span className="text-[11px] font-comic font-bold text-stone-400">TURNS SURVIVED</span>
            <span className="font-bangers text-2xl text-amber-300">{stats.turnsPlayed}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-comic font-bold text-stone-400">KITTENS DEFUSED</span>
            <span className="font-bangers text-2xl text-emerald-400">{stats.kittensDefused}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-comic font-bold text-stone-400">ATTACKS PLAYED</span>
            <span className="font-bangers text-2xl text-orange-400">{stats.attacksPlayed}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-comic font-bold text-stone-400">CARDS STOLEN</span>
            <span className="font-bangers text-2xl text-cyan-400">{stats.cardsStolen}</span>
          </div>
        </div>

        <button
          onClick={onPlayAgain}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-b from-yellow-400 to-amber-500 border-3 border-stone-900 font-bangers text-stone-950 text-xl tracking-wider shadow-[0_6px_0_#000] hover:scale-105 active:translate-y-1 transition-all cursor-pointer"
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
};

export const TutorialModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-[#2a170d] border-4 border-amber-500 rounded-3xl max-w-xl w-full p-6 text-stone-100 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto">
        <h2 className="font-bangers text-3xl sm:text-4xl text-yellow-400 text-center tracking-wide">
          HOW TO PLAY
        </h2>
        <div className="flex items-center justify-center my-3 text-red-500">
          <KittenSilhouette className="w-16 h-16" />
        </div>

        <div className="space-y-3 font-comic text-xs sm:text-sm text-stone-200">
          <div className="p-3 bg-[#1c0f08] rounded-xl border border-stone-800">
            <strong className="text-red-400 font-bangers text-base block">1. The Golden Rule</strong>
            If you draw an <strong>Exploding Kitten</strong>, you explode and lose the game.
          </div>
          <div className="p-3 bg-[#1c0f08] rounded-xl border border-stone-800">
            <strong className="text-emerald-400 font-bangers text-base block">2. Defuse Cards</strong>
            The only card that saves you from exploding. If you draw a kitten, your Defuse neutralizes it, allowing you to secretly put the kitten back anywhere in the deck!
          </div>
          <div className="p-3 bg-[#1c0f08] rounded-xl border border-stone-800">
            <strong className="text-orange-400 font-bangers text-base block">3. Turn Flow & Actions</strong>
            On your turn, you may play as many action cards as you wish (Skip, Attack, See the Future, Alter the Future, Shuffle, Favor). Your turn ONLY ends when you draw a card from the deck or play a card that terminates your turn (Skip/Attack).
          </div>
          <div className="p-3 bg-[#1c0f08] rounded-xl border border-stone-800">
            <strong className="text-yellow-400 font-bangers text-base block">4. Cat Card Combos</strong>
            Matching pairs of Cat Cards (e.g. 2 Tacocats, 2 Hairy Potato Cats) let you steal 1 random card from any opponent!
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 rounded-xl bg-yellow-400 border-2 border-stone-900 font-bangers text-stone-950 text-base tracking-wider hover:scale-102 cursor-pointer shadow"
        >
          GOT IT, LET'S PLAY!
        </button>
      </div>
    </div>
  );
};
