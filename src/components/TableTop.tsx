import React from 'react';
import { Player, Card, ActionLogItem } from '../types';
import { Gauge } from './Gauge';
import { KittenSilhouette } from './CardArt';
import { CardView } from './CardView';
import { AvatarIcon } from './Avatars';

interface TableTopProps {
  players: Player[];
  activePlayerIndex: number;
  drawPile: Card[];
  discardPile: Card[];
  actionLog: ActionLogItem[];
  chanceOfKitten: number;
  isHumanTurn: boolean;
  onDrawCard: () => void;
  turnsRemaining: number;
}

export const TableTop: React.FC<TableTopProps> = ({
  players,
  activePlayerIndex,
  drawPile,
  discardPile,
  actionLog,
  chanceOfKitten,
  isHumanTurn,
  onDrawCard,
  turnsRemaining,
}) => {
  const topOpponents = players.filter((p) => !p.isHuman);
  const activePlayer = players[activePlayerIndex];
  const lastAction = actionLog[0];
  const topDiscard = discardPile[discardPile.length - 1];
  const kittensInDeck = drawPile.filter((c) => c.type === 'EXPLODING_KITTEN').length;

  return (
    <div className="w-full flex-1 flex flex-col justify-between px-2 sm:px-6 pt-2 pb-2 relative">
      {/* 1. TOP OPPONENTS ROW */}
      <div className="w-full flex items-center justify-around max-w-4xl mx-auto z-10">
        {topOpponents.map((bot) => {
          const isActive = players[activePlayerIndex]?.id === bot.id;
          return (
            <div
              key={bot.id}
              className={`relative flex flex-col items-center group transition-all duration-300 ${
                bot.isDead
                  ? 'opacity-40 grayscale contrast-90 border-stone-900 bg-stone-950/80 rounded-2xl p-2 scale-95 pointer-events-none'
                  : 'p-2'
              }`}
            >
              {/* Bot Name with Comic Outline */}
              <div className="relative mb-1">
                <span
                  className={`font-bangers text-sm sm:text-base tracking-wider drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ${
                    bot.isDead ? 'text-stone-500 line-through' : 'text-amber-100'
                  }`}
                >
                  {bot.name.toUpperCase()}
                </span>
              </div>

              {/* Bot Avatar with Active Turn Glow or Dead state */}
              <div className="relative">
                <div
                  className={`transition-all duration-300 rounded-full p-1 ${
                    isActive && !bot.isDead
                      ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-black/50 shadow-[0_0_25px_rgba(250,204,21,0.8)] scale-110'
                      : ''
                  }`}
                >
                  <AvatarIcon
                    id={bot.avatarId}
                    isDead={bot.isDead}
                    className="w-14 h-14 sm:w-16 sm:h-16"
                  />
                </div>

                {/* Hand Cards Count or Eliminated Badge */}
                {bot.isDead ? (
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-stone-900 border-2 border-stone-700 rounded-full px-2 py-0.5 flex items-center gap-1 shadow-md text-stone-400">
                    <svg viewBox="0 0 24 28" className="w-2.5 h-3 text-stone-400 flex-shrink-0" fill="currentColor">
                      <path d="M4 26h16v-14c0-4.42-3.58-8-8-8s-8 3.58-8 8v14z" fill="#44403c" stroke="#78716c" strokeWidth="1.2" />
                      <path d="M12 7v7M9.5 10h5" stroke="#d6d3d1" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    <span className="font-bangers text-xs leading-none">R.I.P</span>
                  </div>
                ) : (
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-red-600 border-2 border-stone-900 rounded-full px-2 py-0.5 flex items-center gap-1 shadow-md">
                    {/* Tiny card fan icon */}
                    <div className="w-3 h-3 flex items-center justify-center">
                      <div className="w-2.5 h-3 bg-white border border-stone-800 rounded-xs rotate-[-10deg]" />
                    </div>
                    <span className="font-bangers text-white text-xs leading-none">
                      {bot.hand.length}
                    </span>
                  </div>
                )}

                {/* Chat Bubble if bot has dialogue */}
                {bot.dialogue && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-stone-900 border-2 border-stone-900 px-2.5 py-1 rounded-xl shadow-lg whitespace-nowrap z-30 font-comic font-bold text-xs bubble-tail animate-bounce">
                    {bot.dialogue}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. CENTER TABLE AREA */}
      <div className="w-full flex-1 flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-8 my-2 relative max-w-5xl mx-auto">
        {/* Speedometer Chance of Kitten Gauge */}
        <div className="flex items-center justify-center relative">
          <Gauge
            percentage={chanceOfKitten}
            kittenCount={kittensInDeck}
            deckSize={drawPile.length}
          />
        </div>

        {/* Draw Deck & Discard Pile Group */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 relative">
          {/* DRAW DECK */}
          <div className="flex flex-col items-center">
            <div
              onClick={isHumanTurn ? onDrawCard : undefined}
              className={`
                relative w-32 h-44 sm:w-36 sm:h-52 rounded-2xl bg-gradient-to-br from-red-600 to-red-800
                border-4 border-stone-900 shadow-[0_10px_16px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.4)]
                flex flex-col items-center justify-center select-none transition-all duration-200
                ${
                  isHumanTurn
                    ? 'cursor-pointer hover:scale-105 ring-4 ring-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.7)] animate-pulse'
                    : 'cursor-default'
                }
              `}
            >
              {/* Stack depth visual layers */}
              <div className="absolute -bottom-2 -right-2 w-full h-full rounded-2xl bg-red-900 border-2 border-stone-950 -z-10" />
              <div className="absolute -bottom-1 -right-1 w-full h-full rounded-2xl bg-red-800 border-2 border-stone-950 -z-10" />

              {/* Red kitten silhouette graphic */}
              <div className="text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                <KittenSilhouette className="w-20 h-20 sm:w-24 sm:h-24" />
              </div>

              {/* Human Turn Call to Action */}
              {isHumanTurn && (
                <div className="absolute -top-3 bg-yellow-400 text-stone-900 font-bangers text-xs px-2 py-0.5 rounded-full border border-stone-900 shadow-md">
                  CLICK TO DRAW
                </div>
              )}
            </div>

            {/* Remaining cards pill label */}
            <div className="mt-3 bg-[#331c10] border-2 border-[#1c0f08] px-3 py-1 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
              <span className="font-bangers text-amber-200 text-xs sm:text-sm tracking-wider">
                {drawPile.length} CARDS LEFT
              </span>
            </div>
          </div>

          {/* DISCARD PILE */}
          <div className="flex flex-col items-center">
            {topDiscard ? (
              <div className="relative transform rotate-1 transition-transform duration-300">
                {/* Secondary under-card for discard depth */}
                <div className="absolute inset-0 bg-stone-300 rounded-xl border-2 border-stone-900 transform -rotate-3 -z-10" />
                <CardView card={topDiscard} disabled={true} isPlayable={false} size="compact" />
              </div>
            ) : (
              <div className="w-32 h-44 sm:w-36 sm:h-52 rounded-2xl border-4 border-dashed border-stone-600/60 bg-black/20 flex flex-col items-center justify-center p-3 text-center">
                <span className="font-bangers text-stone-400 text-sm">DISCARD PILE</span>
                <span className="text-[10px] text-stone-500 font-comic mt-1">NO CARDS PLAYED</span>
              </div>
            )}
            <div className="mt-3 bg-[#331c10] border-2 border-[#1c0f08] px-3 py-1 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
              <span className="font-bangers text-stone-300 text-xs sm:text-sm tracking-wider">
                DISCARD ({discardPile.length})
              </span>
            </div>
          </div>
        </div>

        {/* PARCHMENT BULLETIN / ACTION LOG (Matches screenshot hanging scroll) */}
        <div className="w-64 sm:w-72 relative select-none">
          {/* Wooden Top Dowel */}
          <div className="w-full h-3.5 bg-gradient-to-r from-[#532813] via-[#854d27] to-[#532813] rounded-full border border-stone-950 shadow-md relative flex items-center justify-between px-2">
            <div className="w-2.5 h-2.5 rounded-full bg-stone-800 border border-stone-400 shadow-sm" />
            <div className="w-2.5 h-2.5 rounded-full bg-stone-800 border border-stone-400 shadow-sm" />
          </div>

          {/* Parchment Scroll Sheet */}
          <div className="bg-[#fef9eb] border-x-2 border-b-4 border-[#bca17c] p-3 rounded-b-xl shadow-[0_8px_16px_rgba(0,0,0,0.4)] text-stone-900">
            {/* Action Flow Header */}
            <div className="flex items-center justify-center gap-2 pb-2 border-b-2 border-dashed border-stone-300">
              <AvatarIcon
                id={activePlayer?.avatarId || 'player'}
                isDead={activePlayer?.isDead}
                className="w-8 h-8"
              />
              <span className="text-stone-400 font-bangers text-lg">➔</span>
              <div className="bg-red-600 text-white font-bangers text-xs px-2 py-0.5 rounded-md border border-stone-800 shadow-sm">
                {turnsRemaining > 1 ? `TURNS x${turnsRemaining}` : 'ACTIVE'}
              </div>
            </div>

            {/* Current Big Message */}
            <div className="py-2 text-center">
              <div className="font-bangers text-base sm:text-lg text-stone-900 leading-tight">
                {isHumanTurn ? "IT'S YOUR TURN!" : `${activePlayer?.name.toUpperCase()}'S TURN`}
              </div>
              <p className="text-xs font-comic font-medium text-stone-600 mt-0.5">
                {lastAction ? lastAction.message : 'Waiting for move...'}
              </p>
            </div>

            {/* Mini History log */}
            <div className="mt-1 pt-1.5 border-t border-stone-200 flex flex-col gap-1 max-h-20 overflow-y-auto pr-1">
              {actionLog.slice(0, 3).map((item) => (
                <div key={item.id} className="text-[10px] text-stone-700 flex items-start gap-1">
                  <span className="font-bold text-red-700 whitespace-nowrap">• {item.playerName}:</span>
                  <span className="truncate">{item.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
