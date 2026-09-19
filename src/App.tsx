/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Player,
  Card,
  ActionLogItem,
  MatchStats,
} from './types';
import { initializeGameDecks, shuffleArray } from './deck';
import { sounds } from './audio';
import { fireConfetti } from './utils/confetti';
import { TableTop } from './components/TableTop';
import { PlayerHand } from './components/PlayerHand';
import { TitleScreen } from './components/TitleScreen';
import {
  DefuseModal,
  SeeFutureModal,
  AlterFutureModal,
  TargetSelectModal,
  FavorGiveModal,
  GameOverModal,
  TutorialModal,
} from './components/Modals';

export default function App() {
  // Game states
  const [gamePhase, setGamePhase] = useState<'title' | 'playing' | 'game_over'>('title');
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [turnsRemaining, setTurnsRemaining] = useState<number>(1);
  const [drawPile, setDrawPile] = useState<Card[]>([]);
  const [discardPile, setDiscardPile] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [actionLog, setActionLog] = useState<ActionLogItem[]>([]);

  // Modals & Interactivity
  const [modalType, setModalType] = useState<string | null>(null);
  const [modalData, setModalData] = useState<unknown>(null);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [showInGameMenu, setShowInGameMenu] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // FX Juice
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [explosionFlash, setExplosionFlash] = useState<boolean>(false);

  // Statistics
  const [matchStats, setMatchStats] = useState<MatchStats>({
    turnsPlayed: 0,
    kittensDefused: 0,
    attacksPlayed: 0,
    cardsStolen: 0,
    winnerName: '',
    isHumanWinner: false,
  });

  // Bot memory (for cards seen via See The Future)
  const botKnownTopCards = useRef<Record<string, Card[]>>({});

  // Helper: Log table action
  const logAction = useCallback(
    (playerId: string, playerName: string, message: string, cardType?: Card['type']) => {
      const activeP = players.find((p) => p.id === playerId);
      const newEntry: ActionLogItem = {
        id: `log_${Date.now()}_${Math.random()}`,
        playerId,
        playerName,
        playerAvatar: activeP?.avatarId || 'player',
        cardType,
        message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setActionLog((prev) => [newEntry, ...prev.slice(0, 15)]);
    },
    [players]
  );

  // Sound toggle
  const toggleSound = () => {
    sounds.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  // Start / Restart Game
  const startNewGame = useCallback(() => {
    const { playerHands, drawPile: initialDrawPile } = initializeGameDecks();

    const initialPlayers: Player[] = [
      {
        id: 'p0',
        name: 'YOU',
        isHuman: true,
        avatarId: 'player',
        avatarBg: '#2563eb',
        hand: playerHands[0],
        isDead: false,
        cardsCount: playerHands[0].length,
      },
      {
        id: 'p1',
        name: 'SHARKY',
        isHuman: false,
        avatarId: 'sharky',
        avatarBg: '#0284c7',
        hand: playerHands[1],
        isDead: false,
        cardsCount: playerHands[1].length,
      },
      {
        id: 'p2',
        name: 'BACON CAT',
        isHuman: false,
        avatarId: 'bacon_cat',
        avatarBg: '#f59e0b',
        hand: playerHands[2],
        isDead: false,
        cardsCount: playerHands[2].length,
      },
      {
        id: 'p3',
        name: 'SCHMOOPY',
        isHuman: false,
        avatarId: 'schmoopy',
        avatarBg: '#ec4899',
        hand: playerHands[3],
        isDead: false,
        cardsCount: playerHands[3].length,
      },
    ];

    setPlayers(initialPlayers);
    setActivePlayerIndex(0);
    setTurnsRemaining(1);
    setDrawPile(initialDrawPile);
    setDiscardPile([]);
    setSelectedCards([]);
    setActionLog([
      {
        id: 'init_1',
        playerId: 'p0',
        playerName: 'GAME',
        playerAvatar: 'player',
        message: 'Game started! Hands dealt. Be careful of Exploding Kittens!',
        time: '',
      },
    ]);
    setMatchStats({
      turnsPlayed: 0,
      kittensDefused: 0,
      attacksPlayed: 0,
      cardsStolen: 0,
      winnerName: '',
      isHumanWinner: false,
    });
    setModalType(null);
    setShowInGameMenu(false);
    setGamePhase('playing');
    botKnownTopCards.current = {};
    sounds.playCardDraw();
  }, []);

  // Compute live chance of exploding kitten
  const kittensInDeck = drawPile.filter((c) => c.type === 'EXPLODING_KITTEN').length;
  const chanceOfKitten = drawPile.length > 0 ? (kittensInDeck / drawPile.length) * 100 : 0;

  // Move turn to next alive player
  const advanceTurn = useCallback(
    (currentIdx: number, newTurns = 1) => {
      setPlayers((currentPlayers) => {
        const alivePlayers = currentPlayers.filter((p) => !p.isDead);
        if (alivePlayers.length <= 1) {
          return currentPlayers;
        }

        let nextIdx = (currentIdx + 1) % currentPlayers.length;
        while (currentPlayers[nextIdx].isDead) {
          nextIdx = (nextIdx + 1) % currentPlayers.length;
        }

        setActivePlayerIndex(nextIdx);
        setTurnsRemaining(newTurns);
        setSelectedCards([]);

        const nextPlayer = currentPlayers[nextIdx];
        logAction(
          nextPlayer.id,
          nextPlayer.name,
          `${nextPlayer.name}'s turn (${newTurns} turn${newTurns > 1 ? 's' : ''} to take)`
        );

        return currentPlayers;
      });
    },
    [logAction]
  );

  // Trigger screen explosion effect
  const triggerExplosionFX = () => {
    sounds.playExplosion();
    setScreenShake(true);
    setExplosionFlash(true);
    setTimeout(() => setScreenShake(false), 700);
    setTimeout(() => setExplosionFlash(false), 300);
  };

  // Check Game Over conditions
  useEffect(() => {
    if (gamePhase !== 'playing' || players.length === 0) return;

    const alive = players.filter((p) => !p.isDead);
    if (alive.length === 1) {
      const winner = alive[0];
      setMatchStats((prev) => ({
        ...prev,
        winnerName: winner.name,
        isHumanWinner: winner.isHuman,
      }));
      setGamePhase('game_over');
      if (winner.isHuman) {
        sounds.playVictory();
        fireConfetti();
      }
    }
  }, [players, gamePhase]);

  // DRAW CARD LOGIC
  const handleDrawCard = useCallback(() => {
    if (modalType !== null || drawPile.length === 0) return;

    const currentPlayer = players[activePlayerIndex];
    if (!currentPlayer || currentPlayer.isDead) return;

    const [drawnCard, ...remainingDeck] = drawPile;
    setDrawPile(remainingDeck);

    // If card is an EXPLODING KITTEN
    if (drawnCard.type === 'EXPLODING_KITTEN') {
      const defuseIndex = currentPlayer.hand.findIndex((c) => c.type === 'DEFUSE');

      if (defuseIndex !== -1) {
        // Player has Defuse!
        sounds.playDefuse();
        const defuseCard = currentPlayer.hand[defuseIndex];
        const newHand = [...currentPlayer.hand];
        newHand.splice(defuseIndex, 1);

        setPlayers((prev) =>
          prev.map((p, idx) => (idx === activePlayerIndex ? { ...p, hand: newHand } : p))
        );
        setDiscardPile((prev) => [...prev, defuseCard]);
        setMatchStats((prev) => ({ ...prev, kittensDefused: prev.kittensDefused + 1 }));

        logAction(
          currentPlayer.id,
          currentPlayer.name,
          `DREW AN EXPLODING KITTEN but neutralized it with ${defuseCard.title}!`
        );

        if (currentPlayer.isHuman) {
          // Open defuse placement modal for human
          setModalData({ kittenCard: drawnCard, remainingDeck });
          setModalType('DEFUSE_PROMPT');
          return;
        } else {
          // Bot places kitten secretly (35% top, 50% random, 15% bottom)
          const roll = Math.random();
          const updatedDeck = [...remainingDeck];
          if (roll < 0.35) {
            updatedDeck.unshift(drawnCard); // Top of deck!
          } else if (roll < 0.85) {
            const randPos = Math.floor(Math.random() * (updatedDeck.length + 1));
            updatedDeck.splice(randPos, 0, drawnCard);
          } else {
            updatedDeck.push(drawnCard); // Bottom of deck
          }
          setDrawPile(updatedDeck);

          // Resolve turns remaining
          if (turnsRemaining > 1) {
            setTurnsRemaining((prev) => prev - 1);
          } else {
            advanceTurn(activePlayerIndex, 1);
          }
          return;
        }
      } else {
        // No Defuse -> BOOM! Player exploded!
        triggerExplosionFX();
        logAction(
          currentPlayer.id,
          currentPlayer.name,
          `DREW AN EXPLODING KITTEN and had no Defuse! 💥 BOOM! ${currentPlayer.name} exploded!`
        );

        // Discard all player's cards
        const allPlayerCards = [...currentPlayer.hand, drawnCard];
        setDiscardPile((prev) => [...prev, ...allPlayerCards]);

        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === activePlayerIndex ? { ...p, isDead: true, hand: [] } : p
          )
        );

        // If human died, show defeat modal shortly
        if (currentPlayer.isHuman) {
          setTimeout(() => {
            const remainingAlive = players.filter((p) => !p.isDead && p.id !== currentPlayer.id);
            const winner = remainingAlive[0] || { name: 'AI Opponent', isHuman: false };
            setMatchStats((prev) => ({
              ...prev,
              winnerName: winner.name,
              isHumanWinner: false,
            }));
            setGamePhase('game_over');
          }, 1200);
          return;
        }

        advanceTurn(activePlayerIndex, 1);
        return;
      }
    }

    // Normal safe card drawn
    sounds.playCardDraw();
    logAction(currentPlayer.id, currentPlayer.name, `drew a card from the deck.`);

    setPlayers((prev) =>
      prev.map((p, idx) =>
        idx === activePlayerIndex ? { ...p, hand: [...p.hand, drawnCard] } : p
      )
    );

    setMatchStats((prev) => ({ ...prev, turnsPlayed: prev.turnsPlayed + 1 }));

    // Turn countdown
    if (turnsRemaining > 1) {
      setTurnsRemaining((prev) => prev - 1);
    } else {
      advanceTurn(activePlayerIndex, 1);
    }
  }, [
    activePlayerIndex,
    advanceTurn,
    drawPile,
    logAction,
    modalType,
    players,
    turnsRemaining,
  ]);

  // Handle human placing defused kitten back into deck
  const handleHumanPlaceKitten = (position: 'top' | 'random' | 'bottom' | number) => {
    const data = modalData as { kittenCard: Card; remainingDeck: Card[] };
    if (!data) return;

    const newDeck = [...data.remainingDeck];
    if (position === 'top') {
      newDeck.unshift(data.kittenCard);
      logAction('p0', 'YOU', 'secretly placed the Exploding Kitten on top of the deck! 😈');
    } else if (position === 'bottom') {
      newDeck.push(data.kittenCard);
      logAction('p0', 'YOU', 'secretly placed the Exploding Kitten at the bottom of the deck.');
    } else if (position === 'random') {
      const pos = Math.floor(Math.random() * (newDeck.length + 1));
      newDeck.splice(pos, 0, data.kittenCard);
      logAction('p0', 'YOU', 'secretly shuffled the Exploding Kitten into a random location.');
    } else if (typeof position === 'number') {
      newDeck.splice(position, 0, data.kittenCard);
      logAction('p0', 'YOU', `secretly inserted the Exploding Kitten at position #${position + 1}.`);
    }

    setDrawPile(newDeck);
    setModalType(null);
    setModalData(null);

    // Resolve turns
    if (turnsRemaining > 1) {
      setTurnsRemaining((prev) => prev - 1);
    } else {
      advanceTurn(activePlayerIndex, 1);
    }
  };

  // PLAY CARD ACTION HANDLER
  const executePlayCard = useCallback(
    (card: Card, targetPlayerId?: string) => {
      const currentPlayer = players[activePlayerIndex];
      if (!currentPlayer) return;

      sounds.playCardPlay();

      // Remove card from current player's hand and put on discard pile
      const updatedHand = currentPlayer.hand.filter((c) => c.id !== card.id);
      setPlayers((prev) =>
        prev.map((p, idx) => (idx === activePlayerIndex ? { ...p, hand: updatedHand } : p))
      );
      setDiscardPile((prev) => [...prev, card]);

      switch (card.type) {
        case 'ATTACK': {
          sounds.playSlap();
          setMatchStats((prev) => ({ ...prev, attacksPlayed: prev.attacksPlayed + 1 }));
          const nextTurns = (turnsRemaining > 1 ? turnsRemaining : 0) + 2;
          logAction(
            currentPlayer.id,
            currentPlayer.name,
            `played ${card.title}! Next player must take ${nextTurns} turns!`,
            card.type
          );
          advanceTurn(activePlayerIndex, nextTurns);
          break;
        }

        case 'SKIP': {
          logAction(
            currentPlayer.id,
            currentPlayer.name,
            `played ${card.title} and ended their turn safely!`,
            card.type
          );
          if (turnsRemaining > 1) {
            setTurnsRemaining((prev) => prev - 1);
          } else {
            advanceTurn(activePlayerIndex, 1);
          }
          break;
        }

        case 'SEE_THE_FUTURE': {
          sounds.playFuture();
          const top3 = drawPile.slice(0, 3);
          logAction(
            currentPlayer.id,
            currentPlayer.name,
            `played ${card.title} to peek at the top 3 cards!`,
            card.type
          );
          if (currentPlayer.isHuman) {
            setModalData({ topCards: top3 });
            setModalType('SEE_FUTURE');
          } else {
            botKnownTopCards.current[currentPlayer.id] = top3;
          }
          break;
        }

        case 'ALTER_THE_FUTURE': {
          sounds.playFuture();
          const top3 = drawPile.slice(0, 3);
          logAction(
            currentPlayer.id,
            currentPlayer.name,
            `played ${card.title} and is manipulating time!`,
            card.type
          );
          if (currentPlayer.isHuman) {
            setModalData({ topCards: top3 });
            setModalType('ALTER_FUTURE');
          } else {
            // Bot puts kitten lower if kitten is at top
            if (top3.length > 1 && top3[0].type === 'EXPLODING_KITTEN') {
              const reordered = [top3[1], top3[0], ...top3.slice(2)];
              setDrawPile((prev) => [...reordered, ...prev.slice(top3.length)]);
              botKnownTopCards.current[currentPlayer.id] = reordered;
            }
          }
          break;
        }

        case 'SHUFFLE': {
          sounds.playShuffle();
          setDrawPile((prev) => shuffleArray(prev));
          botKnownTopCards.current = {};
          logAction(
            currentPlayer.id,
            currentPlayer.name,
            `played ${card.title} and thoroughly shuffled the deck!`,
            card.type
          );
          break;
        }

        case 'FAVOR': {
          if (targetPlayerId) {
            resolveFavor(currentPlayer.id, targetPlayerId);
          } else if (currentPlayer.isHuman) {
            setModalData({ card });
            setModalType('FAVOR_TARGET');
          }
          break;
        }

        default:
          break;
      }
    },
    [activePlayerIndex, advanceTurn, drawPile, logAction, players, turnsRemaining]
  );

  // FAVOR RESOLUTION
  const resolveFavor = (requesterId: string, victimId: string) => {
    const requester = players.find((p) => p.id === requesterId);
    const victim = players.find((p) => p.id === victimId);
    if (!requester || !victim || victim.hand.length === 0) return;

    if (victim.isHuman) {
      // Victim is Human: open modal to choose a card to give
      setModalData({ requesterName: requester.name, requesterId });
      setModalType('FAVOR_GIVE');
    } else {
      // Victim is Bot: bot gives a random non-Defuse card, or any card
      const nonDefuseCards = victim.hand.filter((c) => c.type !== 'DEFUSE');
      const cardToGive =
        nonDefuseCards.length > 0
          ? nonDefuseCards[Math.floor(Math.random() * nonDefuseCards.length)]
          : victim.hand[0];

      transferCard(victim.id, requester.id, cardToGive);
      logAction(
        requester.id,
        requester.name,
        `demanded a Favor from ${victim.name} and received a card.`
      );
    }
  };

  // CAT PAIR COMBO RESOLUTION
  const executeCatCombo = (catPair: Card[], targetPlayerId: string) => {
    const currentPlayer = players[activePlayerIndex];
    const victim = players.find((p) => p.id === targetPlayerId);
    if (!currentPlayer || !victim || victim.hand.length === 0) return;

    sounds.playSlap();

    // Discard both cat cards
    const cardIds = catPair.map((c) => c.id);
    const newHand = currentPlayer.hand.filter((c) => !cardIds.includes(c.id));
    setPlayers((prev) =>
      prev.map((p, idx) => (idx === activePlayerIndex ? { ...p, hand: newHand } : p))
    );
    setDiscardPile((prev) => [...prev, ...catPair]);

    // Steal random card from victim
    const randomCard = victim.hand[Math.floor(Math.random() * victim.hand.length)];
    transferCard(victim.id, currentPlayer.id, randomCard);

    setMatchStats((prev) => ({ ...prev, cardsStolen: prev.cardsStolen + 1 }));
    logAction(
      currentPlayer.id,
      currentPlayer.name,
      `played a pair of ${catPair[0].title}s and STOLE a random card from ${victim.name}!`
    );
  };

  // Transfer card between players
  const transferCard = (fromPlayerId: string, toPlayerId: string, card: Card) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === fromPlayerId) {
          return { ...p, hand: p.hand.filter((c) => c.id !== card.id) };
        }
        if (p.id === toPlayerId) {
          return { ...p, hand: [...p.hand, card] };
        }
        return p;
      })
    );
  };

  // HUMAN: CARD CLICK & PLAY
  const handleSelectCard = (card: Card) => {
    if (activePlayerIndex !== 0 || modalType !== null) return;

    if (card.category === 'cat') {
      // Toggle cat card selection (up to 2 of matching type)
      if (selectedCards.some((c) => c.id === card.id)) {
        setSelectedCards((prev) => prev.filter((c) => c.id !== card.id));
      } else {
        if (selectedCards.length === 1 && selectedCards[0].type === card.type) {
          setSelectedCards((prev) => [...prev, card]);
        } else {
          setSelectedCards([card]);
        }
      }
    } else {
      // Action cards: select single card
      if (selectedCards.length === 1 && selectedCards[0].id === card.id) {
        setSelectedCards([]);
      } else {
        setSelectedCards([card]);
      }
    }
  };

  const handlePlaySelected = () => {
    if (selectedCards.length === 0 || activePlayerIndex !== 0) return;

    if (selectedCards.length === 2 && selectedCards[0].category === 'cat') {
      // Cat pair combo: select target opponent
      setModalData({ catPair: selectedCards });
      setModalType('CAT_PAIR_TARGET');
      return;
    }

    if (selectedCards.length === 1) {
      const card = selectedCards[0];
      setSelectedCards([]);
      executePlayCard(card);
    }
  };

  // BOT AI WORKER
  useEffect(() => {
    if (gamePhase !== 'playing' || modalType !== null) return;

    const currentBot = players[activePlayerIndex];
    if (!currentBot || currentBot.isHuman || currentBot.isDead) return;

    const botTimer = setTimeout(() => {
      // 1. Check if bot has seen an Exploding Kitten on top
      const knownTop = botKnownTopCards.current[currentBot.id];
      const nextIsKitten = knownTop && knownTop[0]?.type === 'EXPLODING_KITTEN';

      // 2. Look for evasive cards in hand
      const attackCard = currentBot.hand.find((c) => c.type === 'ATTACK');
      const skipCard = currentBot.hand.find((c) => c.type === 'SKIP');
      const seeFutureCard = currentBot.hand.find((c) => c.type === 'SEE_THE_FUTURE');
      const alterFutureCard = currentBot.hand.find((c) => c.type === 'ALTER_THE_FUTURE');
      const shuffleCard = currentBot.hand.find((c) => c.type === 'SHUFFLE');
      const favorCard = currentBot.hand.find((c) => c.type === 'FAVOR');

      // Check for Cat Pairs
      const catCounts: Record<string, Card[]> = {};
      currentBot.hand.forEach((c) => {
        if (c.category === 'cat') {
          catCounts[c.type] = catCounts[c.type] || [];
          catCounts[c.type].push(c);
        }
      });
      const playablePairKey = Object.keys(catCounts).find((k) => catCounts[k].length >= 2);

      // Evasive Priority if Danger is High or Kitten is Next
      if (nextIsKitten || chanceOfKitten > 25) {
        if (alterFutureCard) {
          executePlayCard(alterFutureCard);
          return;
        }
        if (attackCard) {
          executePlayCard(attackCard);
          return;
        }
        if (skipCard) {
          executePlayCard(skipCard);
          return;
        }
        if (shuffleCard && nextIsKitten) {
          executePlayCard(shuffleCard);
          return;
        }
        if (seeFutureCard && !knownTop) {
          executePlayCard(seeFutureCard);
          return;
        }
      }

      // Offensive / Thievery Priority (Pairs or Favor)
      if (playablePairKey && Math.random() < 0.6) {
        const catPair = catCounts[playablePairKey].slice(0, 2);
        // Target richest opponent
        const opponents = players.filter((p) => p.id !== currentBot.id && !p.isDead && p.hand.length > 0);
        if (opponents.length > 0) {
          opponents.sort((a, b) => b.hand.length - a.hand.length);
          executeCatCombo(catPair, opponents[0].id);
          return;
        }
      }

      if (favorCard && Math.random() < 0.5) {
        const opponents = players.filter((p) => p.id !== currentBot.id && !p.isDead && p.hand.length > 0);
        if (opponents.length > 0) {
          opponents.sort((a, b) => b.hand.length - a.hand.length);
          executePlayCard(favorCard, opponents[0].id);
          return;
        }
      }

      if (seeFutureCard && Math.random() < 0.4 && !knownTop) {
        executePlayCard(seeFutureCard);
        return;
      }

      // Default: Draw from the deck
      handleDrawCard();
    }, 1100);

    return () => clearTimeout(botTimer);
  }, [
    activePlayerIndex,
    chanceOfKitten,
    executePlayCard,
    gamePhase,
    handleDrawCard,
    modalType,
    players,
  ]);

  // Title Screen view
  if (gamePhase === 'title') {
    return (
      <div className="w-full h-screen">
        <TitleScreen
          onStartGame={startNewGame}
          onOpenTutorial={() => setShowTutorial(true)}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
        />
        {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
      </div>
    );
  }

  const humanPlayer = players[0] || {
    id: 'p0',
    name: 'YOU',
    isHuman: true,
    avatarId: 'player',
    avatarBg: '#2563eb',
    hand: [],
    isDead: false,
    cardsCount: 0,
  };

  const isHumanTurn = activePlayerIndex === 0 && !humanPlayer.isDead && modalType === null;

  return (
    <div
      className={`w-full h-screen wood-tabletop flex flex-col justify-between overflow-hidden relative ${
        screenShake ? 'animate-shake' : ''
      }`}
    >
      {/* Red Comic Flash on Explosion */}
      {explosionFlash && (
        <div className="fixed inset-0 z-50 bg-red-600/70 flex items-center justify-center pointer-events-none animate-in fade-in duration-75">
          <span className="font-bangers text-7xl sm:text-9xl text-yellow-300 drop-shadow-[0_8px_0_#000] rotate-[-8deg] animate-ping">
            BOOM!
          </span>
        </div>
      )}

      {/* TOP HEADER BAR */}
      <header className="w-full flex items-center justify-between px-3 sm:px-6 py-2 bg-black/40 backdrop-blur-xs border-b border-black/30 z-30 select-none">
        {/* Menu / Leave Game button (matches screenshot top-left) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInGameMenu(true)}
            className="px-3 py-1.5 rounded-xl bg-[#4a2414] hover:bg-[#61301b] border-2 border-stone-900 font-bangers text-amber-200 text-xs sm:text-sm tracking-wider shadow-[0_2px_0_#000] cursor-pointer transition-all active:translate-y-0.5"
          >
            MENU / PAUSE
          </button>
          <button
            onClick={() => setShowTutorial(true)}
            className="w-8 h-8 rounded-full bg-[#4a2414] hover:bg-[#61301b] border-2 border-stone-900 font-bangers text-amber-200 text-sm flex items-center justify-center shadow-[0_2px_0_#000] cursor-pointer"
          >
            ?
          </button>
        </div>

        {/* Center Live Turn Banner */}
        <div className="font-bangers text-sm sm:text-base tracking-wider text-amber-100 flex items-center gap-2">
          <span>DECK: {drawPile.length}</span>
          <span className="text-stone-500">•</span>
          <span>KITTENS: {kittensInDeck}</span>
          <span className="text-stone-500">•</span>
          <span className={chanceOfKitten > 35 ? 'text-red-400 font-bold' : chanceOfKitten > 15 ? 'text-amber-400' : 'text-emerald-400'}>
            CHANCE: {Math.round(chanceOfKitten)}%
          </span>
        </div>

        {/* Right Sound Toggle */}
        <button
          onClick={toggleSound}
          className="w-8 h-8 rounded-full bg-[#4a2414] hover:bg-[#61301b] border-2 border-stone-900 text-amber-200 text-xs flex items-center justify-center shadow-[0_2px_0_#000] cursor-pointer"
          title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </header>

      {/* CENTER TABLE AREA */}
      <TableTop
        players={players}
        activePlayerIndex={activePlayerIndex}
        drawPile={drawPile}
        discardPile={discardPile}
        actionLog={actionLog}
        chanceOfKitten={chanceOfKitten}
        isHumanTurn={isHumanTurn}
        onDrawCard={handleDrawCard}
        turnsRemaining={turnsRemaining}
      />

      {/* BOTTOM HUMAN PLAYER HAND */}
      <PlayerHand
        player={humanPlayer}
        isHumanTurn={isHumanTurn}
        selectedCards={selectedCards}
        onSelectCard={handleSelectCard}
        onPlaySelected={handlePlaySelected}
        turnsRemaining={turnsRemaining}
      />

      {/* MODALS */}
      {/* 1. Defuse Placement Modal */}
      {modalType === 'DEFUSE_PROMPT' && (
        <DefuseModal
          deckSize={drawPile.length}
          onPlaceKitten={handleHumanPlaceKitten}
        />
      )}

      {/* 2. See The Future Modal */}
      {modalType === 'SEE_FUTURE' && (
        <SeeFutureModal
          cards={(modalData as { topCards: Card[] })?.topCards || []}
          onClose={() => {
            setModalType(null);
            setModalData(null);
          }}
        />
      )}

      {/* 3. Alter The Future Modal */}
      {modalType === 'ALTER_FUTURE' && (
        <AlterFutureModal
          initialCards={(modalData as { topCards: Card[] })?.topCards || []}
          onConfirm={(reordered) => {
            setDrawPile((prev) => [...reordered, ...prev.slice(reordered.length)]);
            logAction('p0', 'YOU', 'rearranged the top cards of the deck.');
            setModalType(null);
            setModalData(null);
          }}
        />
      )}

      {/* 4. Favor Target Modal */}
      {modalType === 'FAVOR_TARGET' && (
        <TargetSelectModal
          title="DEMAND A FAVOR"
          subtitle="Choose an opponent who must give you 1 card from their hand:"
          opponents={players.filter((p) => !p.isHuman)}
          onSelect={(targetId) => {
            const data = modalData as { card: Card };
            setModalType(null);
            setModalData(null);
            executePlayCard(data.card, targetId);
          }}
          onCancel={() => {
            setModalType(null);
            setModalData(null);
          }}
        />
      )}

      {/* 5. Cat Pair Combo Target Modal */}
      {modalType === 'CAT_PAIR_TARGET' && (
        <TargetSelectModal
          title="CAT PAIR COMBO: STEAL A CARD!"
          subtitle="Select a player to steal 1 random card from:"
          opponents={players.filter((p) => !p.isHuman)}
          onSelect={(targetId) => {
            const data = modalData as { catPair: Card[] };
            setModalType(null);
            setModalData(null);
            setSelectedCards([]);
            executeCatCombo(data.catPair, targetId);
          }}
          onCancel={() => {
            setModalType(null);
            setModalData(null);
          }}
        />
      )}

      {/* 6. Favor Give Modal (When Bot demands from Human) */}
      {modalType === 'FAVOR_GIVE' && (
        <FavorGiveModal
          requesterName={(modalData as { requesterName: string })?.requesterName || 'Bot'}
          cards={humanPlayer.hand}
          onGiveCard={(cardToGive) => {
            const data = modalData as { requesterId: string; requesterName: string };
            transferCard('p0', data.requesterId, cardToGive);
            logAction('p0', 'YOU', `surrendered ${cardToGive.title} to ${data.requesterName}.`);
            setModalType(null);
            setModalData(null);
          }}
        />
      )}

      {/* 7. Game Over Screen */}
      {gamePhase === 'game_over' && (
        <GameOverModal stats={matchStats} onPlayAgain={startNewGame} />
      )}

      {/* 8. Tutorial Modal */}
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}

      {/* 9. In-Game Menu Modal */}
      {showInGameMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#2a170d] border-4 border-amber-500 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl flex flex-col items-center">
            <h2 className="font-bangers text-3xl text-yellow-400 mb-4">GAME MENU</h2>
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => setShowInGameMenu(false)}
                className="w-full py-2.5 rounded-xl bg-yellow-400 border-2 border-stone-900 font-bangers text-stone-950 text-base hover:scale-102 cursor-pointer shadow"
              >
                RESUME GAME
              </button>
              <button
                onClick={toggleSound}
                className="w-full py-2 rounded-xl bg-stone-800 border border-stone-700 font-bangers text-amber-200 text-sm hover:bg-stone-700 cursor-pointer"
              >
                {soundEnabled ? '🔊 SFX SOUND: ON' : '🔇 SFX SOUND: MUTED'}
              </button>
              <button
                onClick={() => {
                  setShowInGameMenu(false);
                  setShowTutorial(true);
                }}
                className="w-full py-2 rounded-xl bg-stone-800 border border-stone-700 font-bangers text-amber-200 text-sm hover:bg-stone-700 cursor-pointer"
              >
                HOW TO PLAY (RULES)
              </button>
              <button
                onClick={startNewGame}
                className="w-full py-2 rounded-xl bg-orange-600 border border-stone-900 font-bangers text-white text-sm hover:bg-orange-500 cursor-pointer"
              >
                RESTART ROUND
              </button>
              <button
                onClick={() => {
                  setShowInGameMenu(false);
                  setGamePhase('title');
                }}
                className="w-full py-2 rounded-xl bg-red-700 border border-stone-900 font-bangers text-white text-sm hover:bg-red-600 cursor-pointer"
              >
                LEAVE GAME TO TITLE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
