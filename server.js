import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = 3000;

// Serve public static assets
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to public/index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ==========================================
// CARD DEFINITIONS & DECK MANAGEMENT
// ==========================================
const CARD_TEMPLATES = {
  EXPLODING_KITTEN: {
    type: 'EXPLODING_KITTEN',
    title: 'EXPLODING KITTEN',
    subTitle: 'RUN FOR YOUR LIFE',
    actionText: 'EXPLODE IMMEDIATELY',
    flavorText: 'Unless you have a Defuse card, you explode and lose the game!',
    category: 'danger',
    badgeColor: '#ef4444',
    bgTone: '#fee2e2',
    iconName: 'bomb',
  },
  DEFUSE: {
    type: 'DEFUSE',
    title: 'DEFUSE (LASER POINTER)',
    subTitle: 'OF GREAT CAT JUSTICE',
    actionText: 'DEFUSE EXPLOSION',
    flavorText: 'Distract the kitten and place it anywhere secretly in the deck.',
    category: 'defuse',
    badgeColor: '#22c55e',
    bgTone: '#dcfce7',
    iconName: 'laser',
  },
  ATTACK: {
    type: 'ATTACK',
    title: 'SINGLE SLAP (ATTACK)',
    subTitle: 'TIGER PAW STRIKE',
    actionText: 'END TURN & STACK 2 TURNS',
    flavorText: 'End your turn without drawing and force the next victim to take 2 turns!',
    category: 'action',
    badgeColor: '#ea580c',
    bgTone: '#ffedd5',
    iconName: 'paw',
  },
  SKIP: {
    type: 'SKIP',
    title: 'SPRINT AWAY (SKIP)',
    subTitle: 'FROM THE PREMISES',
    actionText: 'END TURN WITHOUT DRAWING',
    flavorText: 'Immediately end your turn without drawing a card. Safe for now!',
    category: 'action',
    badgeColor: '#3b82f6',
    bgTone: '#dbeafe',
    iconName: 'run',
  },
  SEE_THE_FUTURE: {
    type: 'SEE_THE_FUTURE',
    title: 'SEE THE FUTURE (3X)',
    subTitle: 'CRYSTAL BALL OF OMEN',
    actionText: 'PEEK TOP 3 CARDS',
    flavorText: 'Privately peek at the top 3 cards from the Draw Pile without altering.',
    category: 'action',
    badgeColor: '#9333ea',
    bgTone: '#f3e8ff',
    iconName: 'eye',
  },
  ALTER_THE_FUTURE: {
    type: 'ALTER_THE_FUTURE',
    title: 'ALTER THE FUTURE',
    subTitle: 'TEMPORAL VORTEX',
    actionText: 'REORDER TOP 3 CARDS',
    flavorText: 'Peek at top 3 cards and rearrange them in any sequence you desire!',
    category: 'action',
    badgeColor: '#c026d3',
    bgTone: '#fae8ff',
    iconName: 'vortex',
  },
  FAVOR: {
    type: 'FAVOR',
    title: 'FAVOR (I\'LL TAKE THAT)',
    subTitle: 'SEND IN A VAMPUG',
    actionText: 'FORCE 1 CARD GIFT',
    flavorText: 'Select an opponent. They must give you 1 card of their choice.',
    category: 'action',
    badgeColor: '#06b6d4',
    bgTone: '#cffafe',
    iconName: 'grab',
  },
  SHUFFLE: {
    type: 'SHUFFLE',
    title: 'SHUFFLE',
    subTitle: 'PANIC TORNADO',
    actionText: 'SHUFFLE DRAW PILE',
    flavorText: 'Thoroughly randomize the Draw Pile until someone gets dizzy.',
    category: 'action',
    badgeColor: '#78716c',
    bgTone: '#f5f5f4',
    iconName: 'shuffle',
  },
  CAT_HAIRY_POTATO: {
    type: 'CAT_HAIRY_POTATO',
    title: 'HAIRY POTATO CAT',
    subTitle: 'STEAL A CARD (PAIR)',
    actionText: 'PLAY 2 TO STEAL',
    flavorText: 'Play a matching pair to steal a random card from any player.',
    category: 'cat',
    badgeColor: '#84cc16',
    bgTone: '#ecfccb',
    iconName: 'potato',
  },
  CAT_TACOCAT: {
    type: 'CAT_TACOCAT',
    title: 'TACOCAT',
    subTitle: 'I AM A PALINDROME',
    actionText: 'PLAY 2 TO STEAL',
    flavorText: 'Spelled backwards or forwards, Tacocat steals a random card when paired.',
    category: 'cat',
    badgeColor: '#eab308',
    bgTone: '#fef9c3',
    iconName: 'taco',
  },
  CAT_RAINBOW_RALPHING: {
    type: 'CAT_RAINBOW_RALPHING',
    title: 'RAINBOW RALPHING CAT',
    subTitle: 'SPEWS GORGEOUS PRISMS',
    actionText: 'PLAY 2 TO STEAL',
    flavorText: 'Pair up two Ralphers to loot a card from the victim of your choice.',
    category: 'cat',
    badgeColor: '#ec4899',
    bgTone: '#fce7f3',
    iconName: 'rainbow',
  },
  CAT_BEARD: {
    type: 'CAT_BEARD',
    title: 'BEARD CAT',
    subTitle: 'LUMBERJACK WHISKERS',
    actionText: 'PLAY 2 TO STEAL',
    flavorText: 'Fierce facial plumage. Combine 2 Beard Cats to rob an opponent.',
    category: 'cat',
    badgeColor: '#b45309',
    bgTone: '#fef3c7',
    iconName: 'beard',
  },
  CAT_CATTERMELON: {
    type: 'CAT_CATTERMELON',
    title: 'CATTERMELON',
    subTitle: 'SEEDY & FEROCIOUS',
    actionText: 'PLAY 2 TO STEAL',
    flavorText: 'Refreshing yet deadly fruit beast. Play a pair to steal 1 random card.',
    category: 'cat',
    badgeColor: '#10b981',
    bgTone: '#d1fae5',
    iconName: 'melon',
  },
};

let globalCardSeq = 0;
function createCard(type) {
  globalCardSeq++;
  const def = CARD_TEMPLATES[type];
  return {
    ...def,
    id: `c_${type}_${globalCardSeq}_${Math.random().toString(36).substr(2, 6)}`,
  };
}

function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const BOT_NAMES = [
  { name: 'Sharky', avatarId: 'sharky' },
  { name: 'Bacon Cat', avatarId: 'bacon_cat' },
  { name: 'Schmoopy', avatarId: 'schmoopy' },
  { name: 'Otho', avatarId: 'otho' },
  { name: 'Lydia', avatarId: 'lydia' },
];

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'KTN-';
  for (let i = 0; i < 3; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// ==========================================
// IN-MEMORY GAME STATE STORE
// ==========================================
const rooms = new Map(); // roomId -> RoomObject
const socketToRoom = new Map(); // socketId -> roomId

class GameRoom {
  constructor(id, code, isPrivate, hostSocketId, hostName, hostAvatar) {
    this.id = id;
    this.code = code;
    this.isPrivate = isPrivate;
    this.hostId = hostSocketId;
    this.gameStarted = false;
    this.maxPlayers = 5;
    this.players = [
      {
        id: hostSocketId,
        socketId: hostSocketId,
        name: hostName || 'Captain Kitten',
        avatarId: hostAvatar || 'player',
        isHost: true,
        isReady: true,
        isBot: false,
        isDead: false,
        hand: [],
        disconnectedAt: null,
      },
    ];

    // Game play states
    this.drawPile = [];
    this.discardPile = [];
    this.activePlayerIndex = 0;
    this.turnsRemaining = 1;
    this.actionLog = [];
    this.turnState = 'NORMAL'; // 'NORMAL' | 'AWAITING_DEFUSE' | 'AWAITING_FAVOR' | 'ALTERING_FUTURE'
    this.turnStateData = null;
    this.botTimer = null;
    this.botKnownTopCards = {};
    this.matchStats = {
      turnsPlayed: 0,
      kittensDefused: 0,
      attacksPlayed: 0,
      cardsStolen: 0,
      winnerName: '',
      isHumanWinner: false,
    };
  }

  log(playerName, playerAvatar, message, cardType = null) {
    const entry = {
      id: `log_${Date.now()}_${Math.random()}`,
      playerName,
      playerAvatar,
      message,
      cardType,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    this.actionLog.unshift(entry);
    if (this.actionLog.length > 20) {
      this.actionLog.pop();
    }
  }

  broadcastLobby() {
    io.to(this.id).emit('room_updated', {
      roomId: this.id,
      roomCode: this.code,
      isPrivate: this.isPrivate,
      hostId: this.hostId,
      gameStarted: this.gameStarted,
      players: this.players.map((p) => ({
        id: p.id,
        name: p.name,
        avatarId: p.avatarId,
        isHost: p.isHost,
        isReady: p.isReady,
        isBot: p.isBot,
        isDead: p.isDead,
        cardCount: p.hand.length,
      })),
    });
  }

  // Authoritative State Redaction & Data Masking:
  // Each client receives only their own hand, opponent card counts, and deck size!
  broadcastGameState() {
    const kittensInDeck = this.drawPile.filter((c) => c.type === 'EXPLODING_KITTEN').length;
    const chanceOfKitten =
      this.drawPile.length > 0 ? (kittensInDeck / this.drawPile.length) * 100 : 0;

    const publicPlayers = this.players.map((p) => ({
      id: p.id,
      name: p.name,
      avatarId: p.avatarId,
      isHost: p.isHost,
      isBot: p.isBot,
      isDead: p.isDead,
      cardCount: p.hand.length,
    }));

    for (const player of this.players) {
      if (player.isBot || !player.socketId) continue;

      const maskedPayload = {
        roomId: this.id,
        roomCode: this.code,
        gameStarted: this.gameStarted,
        activePlayerIndex: this.activePlayerIndex,
        turnsRemaining: this.turnsRemaining,
        deckCount: this.drawPile.length,
        kittensInDeck,
        chanceOfKitten,
        discardPile: this.discardPile,
        topDiscard: this.discardPile[this.discardPile.length - 1] || null,
        actionLog: this.actionLog,
        turnState: this.turnState,
        turnStateData:
          this.turnStateData?.targetSocketId === player.socketId ||
          this.turnStateData?.requesterSocketId === player.socketId
            ? this.turnStateData
            : null,
        players: publicPlayers,
        myHand: player.hand,
        myId: player.id,
        isMyTurn: this.players[this.activePlayerIndex]?.id === player.id,
      };

      io.to(player.socketId).emit('game_state', maskedPayload);
    }
  }

  setupGame() {
    this.gameStarted = true;
    this.turnState = 'NORMAL';
    this.turnStateData = null;
    this.activePlayerIndex = 0;
    this.turnsRemaining = 1;
    this.discardPile = [];
    this.botKnownTopCards = {};

    // 1. Build standard pool
    const pool = [];
    const counts = [
      { type: 'ATTACK', count: 4 },
      { type: 'SKIP', count: 4 },
      { type: 'SEE_THE_FUTURE', count: 5 },
      { type: 'ALTER_THE_FUTURE', count: 3 },
      { type: 'FAVOR', count: 4 },
      { type: 'SHUFFLE', count: 4 },
      { type: 'CAT_HAIRY_POTATO', count: 4 },
      { type: 'CAT_TACOCAT', count: 4 },
      { type: 'CAT_RAINBOW_RALPHING', count: 4 },
      { type: 'CAT_BEARD', count: 4 },
      { type: 'CAT_CATTERMELON', count: 4 },
    ];

    counts.forEach((item) => {
      for (let i = 0; i < item.count; i++) {
        pool.push(createCard(item.type));
      }
    });

    const shuffledPool = shuffle(pool);

    // 2. Deal 1 Defuse and 4 random cards to each player
    const playerCount = this.players.length;
    const defuses = [];
    // 6 defuses total in standard deck
    for (let i = 0; i < 6; i++) {
      defuses.push(createCard('DEFUSE'));
    }

    let poolIdx = 0;
    this.players.forEach((player, idx) => {
      player.isDead = false;
      player.hand = [];
      // 1 Defuse
      player.hand.push(defuses[idx]);
      // 4 random cards
      for (let c = 0; c < 4; c++) {
        player.hand.push(shuffledPool[poolIdx++]);
      }
    });

    // 3. Assemble Draw Deck:
    // (Player Count - 1) Exploding Kittens + remaining Defuses + remaining pool
    const explodingKittensCount = Math.max(1, playerCount - 1);
    const explodingKittens = [];
    for (let k = 0; k < explodingKittensCount; k++) {
      explodingKittens.push(createCard('EXPLODING_KITTEN'));
    }

    const leftoverDefuses = defuses.slice(playerCount);
    const leftoverPool = shuffledPool.slice(poolIdx);

    this.drawPile = shuffle([...leftoverPool, ...leftoverDefuses, ...explodingKittens]);

    this.log('GAME', 'player', 'Match started! Hands dealt. Beware of Exploding Kittens!');
    this.broadcastLobby();
    this.broadcastGameState();

    this.checkBotTurn();
  }

  advanceTurn(newTurns = 1) {
    const alive = this.players.filter((p) => !p.isDead);
    if (alive.length <= 1) {
      this.checkGameOver();
      return;
    }

    let nextIdx = (this.activePlayerIndex + 1) % this.players.length;
    while (this.players[nextIdx].isDead) {
      nextIdx = (nextIdx + 1) % this.players.length;
    }

    this.activePlayerIndex = nextIdx;
    this.turnsRemaining = newTurns;
    this.turnState = 'NORMAL';
    this.turnStateData = null;

    const nextP = this.players[nextIdx];
    this.log(
      nextP.name,
      nextP.avatarId,
      `${nextP.name}'s turn (${newTurns} turn${newTurns > 1 ? 's' : ''} to take)`
    );

    this.broadcastGameState();
    this.checkBotTurn();
  }

  checkGameOver() {
    const alive = this.players.filter((p) => !p.isDead);
    if (alive.length === 1) {
      const winner = alive[0];
      this.matchStats.winnerName = winner.name;
      this.matchStats.isHumanWinner = !winner.isBot;

      this.log(
        winner.name,
        winner.avatarId,
        `👑 VICTORY! ${winner.name} survived and won the match!`
      );

      io.to(this.id).emit('game_over', {
        winnerId: winner.id,
        winnerName: winner.name,
        winnerAvatar: winner.avatarId,
        isHumanWinner: !winner.isBot,
        stats: this.matchStats,
      });

      this.broadcastGameState();
    }
  }

  // BOT AI TURN WORKER
  checkBotTurn() {
    clearTimeout(this.botTimer);
    if (!this.gameStarted) return;

    const currentP = this.players[this.activePlayerIndex];
    if (!currentP || !currentP.isBot || currentP.isDead) return;

    this.botTimer = setTimeout(() => {
      this.executeBotMove(currentP);
    }, 1200);
  }

  executeBotMove(bot) {
    if (this.turnState !== 'NORMAL') return;

    const kittensInDeck = this.drawPile.filter((c) => c.type === 'EXPLODING_KITTEN').length;
    const chance = (kittensInDeck / this.drawPile.length) * 100;
    const knownTop = this.botKnownTopCards[bot.id];
    const topIsKitten = knownTop && knownTop[0]?.type === 'EXPLODING_KITTEN';

    const alterFuture = bot.hand.find((c) => c.type === 'ALTER_THE_FUTURE');
    const attack = bot.hand.find((c) => c.type === 'ATTACK');
    const skip = bot.hand.find((c) => c.type === 'SKIP');
    const seeFuture = bot.hand.find((c) => c.type === 'SEE_THE_FUTURE');
    const shuffleCard = bot.hand.find((c) => c.type === 'SHUFFLE');
    const favor = bot.hand.find((c) => c.type === 'FAVOR');

    // Cat card pairs
    const catCounts = {};
    bot.hand.forEach((c) => {
      if (c.category === 'cat') {
        catCounts[c.type] = catCounts[c.type] || [];
        catCounts[c.type].push(c);
      }
    });
    const pairType = Object.keys(catCounts).find((k) => catCounts[k].length >= 2);

    // Evasion if kitten is next or chance is high
    if (topIsKitten || chance > 25) {
      if (alterFuture) {
        this.playCard(bot.id, alterFuture.id);
        return;
      }
      if (attack) {
        this.playCard(bot.id, attack.id);
        return;
      }
      if (skip) {
        this.playCard(bot.id, skip.id);
        return;
      }
      if (shuffleCard && topIsKitten) {
        this.playCard(bot.id, shuffleCard.id);
        return;
      }
      if (seeFuture && !knownTop) {
        this.playCard(bot.id, seeFuture.id);
        return;
      }
    }

    // Cat pair combo steal
    if (pairType && Math.random() < 0.6) {
      const pair = catCounts[pairType].slice(0, 2);
      const targets = this.players.filter(
        (p) => p.id !== bot.id && !p.isDead && p.hand.length > 0
      );
      if (targets.length > 0) {
        targets.sort((a, b) => b.hand.length - a.hand.length);
        this.playCatPair(bot.id, pair.map((c) => c.id), targets[0].id);
        return;
      }
    }

    // Favor steal
    if (favor && Math.random() < 0.5) {
      const targets = this.players.filter(
        (p) => p.id !== bot.id && !p.isDead && p.hand.length > 0
      );
      if (targets.length > 0) {
        targets.sort((a, b) => b.hand.length - a.hand.length);
        this.playFavor(bot.id, favor.id, targets[0].id);
        return;
      }
    }

    if (seeFuture && Math.random() < 0.4 && !knownTop) {
      this.playCard(bot.id, seeFuture.id);
      return;
    }

    // Draw from deck
    this.drawCard(bot.id);
  }

  // DRAW CARD ACTION
  drawCard(playerId) {
    const currentP = this.players[this.activePlayerIndex];
    if (!currentP || currentP.id !== playerId || this.turnState !== 'NORMAL') return;

    if (this.drawPile.length === 0) return;

    const drawnCard = this.drawPile.shift();

    if (drawnCard.type === 'EXPLODING_KITTEN') {
      const defuseIdx = currentP.hand.findIndex((c) => c.type === 'DEFUSE');

      if (defuseIdx !== -1) {
        // Player has Defuse!
        const defuseCard = currentP.hand.splice(defuseIdx, 1)[0];
        this.discardPile.push(defuseCard);
        this.matchStats.kittensDefused++;

        this.log(
          currentP.name,
          currentP.avatarId,
          `DREW AN EXPLODING KITTEN but neutralized it with ${defuseCard.title}!`
        );

        io.to(this.id).emit('kitten_defused', {
          playerId: currentP.id,
          playerName: currentP.name,
        });

        if (currentP.isBot) {
          // Bot places kitten secretly (35% top, 50% random, 15% bottom)
          const roll = Math.random();
          if (roll < 0.35) {
            this.drawPile.unshift(drawnCard);
          } else if (roll < 0.85) {
            const randPos = Math.floor(Math.random() * (this.drawPile.length + 1));
            this.drawPile.splice(randPos, 0, drawnCard);
          } else {
            this.drawPile.push(drawnCard);
          }

          if (this.turnsRemaining > 1) {
            this.turnsRemaining--;
            this.broadcastGameState();
            this.checkBotTurn();
          } else {
            this.advanceTurn(1);
          }
        } else {
          // Human player must choose where to put the kitten
          this.turnState = 'AWAITING_DEFUSE';
          this.turnStateData = {
            kittenCard: drawnCard,
            targetSocketId: currentP.socketId,
          };
          this.broadcastGameState();
        }
      } else {
        // NO DEFUSE -> EXPLODE!
        this.log(
          currentP.name,
          currentP.avatarId,
          `💥 BOOM! ${currentP.name} drew an Exploding Kitten with NO DEFUSE and exploded!`
        );

        currentP.isDead = true;
        this.discardPile.push(drawnCard, ...currentP.hand);
        currentP.hand = [];

        io.to(this.id).emit('player_exploded', {
          playerId: currentP.id,
          playerName: currentP.name,
        });

        this.checkGameOver();

        const alive = this.players.filter((p) => !p.isDead);
        if (alive.length > 1) {
          this.advanceTurn(1);
        } else {
          this.broadcastGameState();
        }
      }
      return;
    }

    // Safe card drawn
    currentP.hand.push(drawnCard);
    this.matchStats.turnsPlayed++;
    this.log(currentP.name, currentP.avatarId, `drew a card from the deck.`);

    io.to(this.id).emit('card_drawn', {
      playerId: currentP.id,
      playerName: currentP.name,
    });

    if (this.turnsRemaining > 1) {
      this.turnsRemaining--;
      this.broadcastGameState();
      this.checkBotTurn();
    } else {
      this.advanceTurn(1);
    }
  }

  // DEFUSE REINSERTION
  defuseKitten(playerId, position) {
    if (this.turnState !== 'AWAITING_DEFUSE') return;
    const currentP = this.players[this.activePlayerIndex];
    if (!currentP || currentP.id !== playerId) return;

    const kittenCard = this.turnStateData?.kittenCard || createCard('EXPLODING_KITTEN');

    if (position === 'top' || position === 0) {
      this.drawPile.unshift(kittenCard);
      this.log(currentP.name, currentP.avatarId, 'secretly planted the kitten on top of the deck! 😈');
    } else if (position === 'bottom') {
      this.drawPile.push(kittenCard);
      this.log(currentP.name, currentP.avatarId, 'secretly tucked the kitten to the bottom of the deck.');
    } else if (position === 'random') {
      const pos = Math.floor(Math.random() * (this.drawPile.length + 1));
      this.drawPile.splice(pos, 0, kittenCard);
      this.log(currentP.name, currentP.avatarId, 'secretly shuffled the kitten into a random spot.');
    } else if (typeof position === 'number') {
      const clamped = Math.max(0, Math.min(this.drawPile.length, position));
      this.drawPile.splice(clamped, 0, kittenCard);
      this.log(currentP.name, currentP.avatarId, `secretly placed the kitten at position #${clamped + 1}.`);
    }

    this.turnState = 'NORMAL';
    this.turnStateData = null;

    if (this.turnsRemaining > 1) {
      this.turnsRemaining--;
      this.broadcastGameState();
      this.checkBotTurn();
    } else {
      this.advanceTurn(1);
    }
  }

  // PLAY REGULAR CARD
  playCard(playerId, cardId) {
    const currentP = this.players[this.activePlayerIndex];
    if (!currentP || currentP.id !== playerId || this.turnState !== 'NORMAL') return;

    const cardIdx = currentP.hand.findIndex((c) => c.id === cardId);
    if (cardIdx === -1) return;

    const card = currentP.hand.splice(cardIdx, 1)[0];
    this.discardPile.push(card);

    io.to(this.id).emit('card_played', {
      playerId: currentP.id,
      playerName: currentP.name,
      card,
    });

    switch (card.type) {
      case 'ATTACK': {
        this.matchStats.attacksPlayed++;
        const nextTurns = (this.turnsRemaining > 1 ? this.turnsRemaining : 0) + 2;
        this.log(
          currentP.name,
          currentP.avatarId,
          `played ${card.title}! Next player must take ${nextTurns} turns!`,
          card.type
        );
        this.advanceTurn(nextTurns);
        break;
      }

      case 'SKIP': {
        this.log(
          currentP.name,
          currentP.avatarId,
          `played ${card.title} and ended their turn safely!`,
          card.type
        );
        if (this.turnsRemaining > 1) {
          this.turnsRemaining--;
          this.broadcastGameState();
          this.checkBotTurn();
        } else {
          this.advanceTurn(1);
        }
        break;
      }

      case 'SEE_THE_FUTURE': {
        const top3 = this.drawPile.slice(0, 3);
        this.log(
          currentP.name,
          currentP.avatarId,
          `played ${card.title} to peek at the top 3 cards!`,
          card.type
        );

        if (currentP.isBot) {
          this.botKnownTopCards[currentP.id] = top3;
          this.broadcastGameState();
          this.checkBotTurn();
        } else {
          io.to(currentP.socketId).emit('see_future_result', { cards: top3 });
          this.broadcastGameState();
        }
        break;
      }

      case 'ALTER_THE_FUTURE': {
        const top3 = this.drawPile.slice(0, 3);
        this.log(
          currentP.name,
          currentP.avatarId,
          `played ${card.title} and is manipulating timeline!`,
          card.type
        );

        if (currentP.isBot) {
          if (top3.length > 1 && top3[0].type === 'EXPLODING_KITTEN') {
            const reordered = [top3[1], top3[0], ...top3.slice(2)];
            this.drawPile.splice(0, top3.length, ...reordered);
            this.botKnownTopCards[currentP.id] = reordered;
          }
          this.broadcastGameState();
          this.checkBotTurn();
        } else {
          this.turnState = 'ALTERING_FUTURE';
          this.turnStateData = { targetSocketId: currentP.socketId, topCards: top3 };
          io.to(currentP.socketId).emit('alter_future_prompt', { cards: top3 });
          this.broadcastGameState();
        }
        break;
      }

      case 'SHUFFLE': {
        this.drawPile = shuffle(this.drawPile);
        this.botKnownTopCards = {};
        this.log(
          currentP.name,
          currentP.avatarId,
          `played ${card.title} and thoroughly shuffled the deck!`,
          card.type
        );
        this.broadcastGameState();
        this.checkBotTurn();
        break;
      }

      default:
        this.broadcastGameState();
        this.checkBotTurn();
        break;
    }
  }

  // ALTER FUTURE CONFIRMATION
  reorderFuture(playerId, reorderedCardIds) {
    if (this.turnState !== 'ALTERING_FUTURE') return;
    const currentP = this.players[this.activePlayerIndex];
    if (!currentP || currentP.id !== playerId) return;

    const topCards = this.drawPile.slice(0, 3);
    const topIds = topCards.map((c) => c.id).sort();
    const incomingIds = [...reorderedCardIds].sort();

    // Authoritative security check: ensure incoming array matches top cards
    if (JSON.stringify(topIds) === JSON.stringify(incomingIds)) {
      const cardMap = new Map(topCards.map((c) => [c.id, c]));
      const newTop = reorderedCardIds.map((id) => cardMap.get(id)).filter(Boolean);
      this.drawPile.splice(0, newTop.length, ...newTop);
      this.log(currentP.name, currentP.avatarId, 'rearranged the top cards of the deck.');
    }

    this.turnState = 'NORMAL';
    this.turnStateData = null;
    this.broadcastGameState();
    this.checkBotTurn();
  }

  // FAVOR CARD
  playFavor(playerId, cardId, targetPlayerId) {
    const currentP = this.players[this.activePlayerIndex];
    const victim = this.players.find((p) => p.id === targetPlayerId);
    if (!currentP || currentP.id !== playerId || !victim || victim.isDead || victim.hand.length === 0)
      return;

    const cardIdx = currentP.hand.findIndex((c) => c.id === cardId);
    if (cardIdx === -1) return;

    const card = currentP.hand.splice(cardIdx, 1)[0];
    this.discardPile.push(card);

    this.log(
      currentP.name,
      currentP.avatarId,
      `played Favor and demanded a tribute from ${victim.name}!`
    );

    if (victim.isBot) {
      // Bot chooses non-defuse card if available
      const nonDefuse = victim.hand.filter((c) => c.type !== 'DEFUSE');
      const given =
        nonDefuse.length > 0
          ? nonDefuse[Math.floor(Math.random() * nonDefuse.length)]
          : victim.hand[0];

      victim.hand = victim.hand.filter((c) => c.id !== given.id);
      currentP.hand.push(given);
      this.log(victim.name, victim.avatarId, `surrendered a card to ${currentP.name}.`);
      this.broadcastGameState();
      this.checkBotTurn();
    } else {
      // Prompt human victim
      this.turnState = 'AWAITING_FAVOR';
      this.turnStateData = {
        requesterId: currentP.id,
        requesterName: currentP.name,
        targetSocketId: victim.socketId,
      };
      this.broadcastGameState();
    }
  }

  resolveFavorGive(victimId, cardId) {
    if (this.turnState !== 'AWAITING_FAVOR') return;
    const victim = this.players.find((p) => p.id === victimId);
    const requester = this.players.find((p) => p.id === this.turnStateData?.requesterId);

    if (!victim || !requester) return;

    const cardIdx = victim.hand.findIndex((c) => c.id === cardId);
    if (cardIdx === -1) return;

    const givenCard = victim.hand.splice(cardIdx, 1)[0];
    requester.hand.push(givenCard);

    this.log(victim.name, victim.avatarId, `surrendered a card to ${requester.name}.`);

    this.turnState = 'NORMAL';
    this.turnStateData = null;
    this.broadcastGameState();
    this.checkBotTurn();
  }

  // CAT PAIR COMBO
  playCatPair(playerId, pairCardIds, targetPlayerId) {
    const currentP = this.players[this.activePlayerIndex];
    const victim = this.players.find((p) => p.id === targetPlayerId);
    if (!currentP || currentP.id !== playerId || !victim || victim.isDead || victim.hand.length === 0)
      return;

    const cardsToPlay = currentP.hand.filter((c) => pairCardIds.includes(c.id));
    if (cardsToPlay.length !== 2 || cardsToPlay[0].type !== cardsToPlay[1].type) return;

    currentP.hand = currentP.hand.filter((c) => !pairCardIds.includes(c.id));
    this.discardPile.push(...cardsToPlay);

    // Steal random card from victim
    const randIdx = Math.floor(Math.random() * victim.hand.length);
    const stolenCard = victim.hand.splice(randIdx, 1)[0];
    currentP.hand.push(stolenCard);

    this.matchStats.cardsStolen++;
    this.log(
      currentP.name,
      currentP.avatarId,
      `played a pair of ${cardsToPlay[0].title}s and STOLE a card from ${victim.name}!`
    );

    this.broadcastGameState();
    this.checkBotTurn();
  }
}

// ==========================================
// SOCKET.IO EVENT HANDLERS
// ==========================================
io.on('connection', (socket) => {
  console.log(`[Socket] Connected: ${socket.id}`);

  // 1. CREATE ROOM
  socket.on('create_room', ({ playerName, isPrivate, avatarId }, callback) => {
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const roomCode = generateRoomCode();

    const room = new GameRoom(roomId, roomCode, !!isPrivate, socket.id, playerName, avatarId);
    rooms.set(roomId, room);
    socketToRoom.set(socket.id, roomId);
    socket.join(roomId);

    if (callback) {
      callback({
        success: true,
        roomId,
        roomCode,
        isHost: true,
      });
    }

    room.broadcastLobby();
  });

  // 2. JOIN ROOM
  socket.on('join_room', ({ roomCode, playerName, avatarId }, callback) => {
    let targetRoom = null;
    const cleanCode = (roomCode || '').trim().toUpperCase();

    for (const room of rooms.values()) {
      if (room.code === cleanCode || room.id === cleanCode) {
        targetRoom = room;
        break;
      }
    }

    if (!targetRoom) {
      if (callback) callback({ success: false, error: 'ROOM_NOT_FOUND' });
      return;
    }

    if (targetRoom.gameStarted) {
      // Check if rejoining player
      const existing = targetRoom.players.find((p) => p.name === playerName && p.disconnectedAt);
      if (existing) {
        existing.socketId = socket.id;
        existing.disconnectedAt = null;
        socketToRoom.set(socket.id, targetRoom.id);
        socket.join(targetRoom.id);
        targetRoom.log(existing.name, existing.avatarId, 'reconnected to the party!');
        if (callback) callback({ success: true, roomId: targetRoom.id, reconnected: true });
        targetRoom.broadcastLobby();
        targetRoom.broadcastGameState();
        return;
      }

      if (callback) callback({ success: false, error: 'GAME_ALREADY_STARTED' });
      return;
    }

    if (targetRoom.players.length >= targetRoom.maxPlayers) {
      if (callback) callback({ success: false, error: 'ROOM_FULL' });
      return;
    }

    // Add player
    const newPlayer = {
      id: socket.id,
      socketId: socket.id,
      name: playerName || `Player ${targetRoom.players.length + 1}`,
      avatarId: avatarId || 'player',
      isHost: false,
      isReady: false,
      isBot: false,
      isDead: false,
      hand: [],
      disconnectedAt: null,
    };

    targetRoom.players.push(newPlayer);
    socketToRoom.set(socket.id, targetRoom.id);
    socket.join(targetRoom.id);

    targetRoom.log(newPlayer.name, newPlayer.avatarId, 'joined the party!');

    if (callback) {
      callback({
        success: true,
        roomId: targetRoom.id,
        roomCode: targetRoom.code,
        isHost: false,
      });
    }

    targetRoom.broadcastLobby();
  });

  // 3. QUICK MATCH (Play with Strangers)
  socket.on('quick_match', ({ playerName, avatarId }, callback) => {
    // Find open public lobby
    let availableRoom = null;
    for (const room of rooms.values()) {
      if (!room.isPrivate && !room.gameStarted && room.players.length < room.maxPlayers) {
        availableRoom = room;
        break;
      }
    }

    if (availableRoom) {
      // Join existing public room
      const newPlayer = {
        id: socket.id,
        socketId: socket.id,
        name: playerName || `Guest ${availableRoom.players.length + 1}`,
        avatarId: avatarId || 'player',
        isHost: false,
        isReady: false,
        isBot: false,
        isDead: false,
        hand: [],
        disconnectedAt: null,
      };

      availableRoom.players.push(newPlayer);
      socketToRoom.set(socket.id, availableRoom.id);
      socket.join(availableRoom.id);

      if (callback) {
        callback({
          success: true,
          roomId: availableRoom.id,
          roomCode: availableRoom.code,
          isHost: false,
        });
      }

      availableRoom.broadcastLobby();
    } else {
      // Spawn new public room
      const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const roomCode = generateRoomCode();
      const room = new GameRoom(roomId, roomCode, false, socket.id, playerName, avatarId);

      rooms.set(roomId, room);
      socketToRoom.set(socket.id, roomId);
      socket.join(roomId);

      if (callback) {
        callback({
          success: true,
          roomId,
          roomCode,
          isHost: true,
        });
      }

      room.broadcastLobby();
    }
  });

  // 4. TOGGLE READY
  socket.on('toggle_ready', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room || room.gameStarted) return;

    const player = room.players.find((p) => p.socketId === socket.id);
    if (player) {
      player.isReady = !player.isReady;
      room.broadcastLobby();
    }
  });

  // 5. ADD BOT
  socket.on('add_bot', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room || room.gameStarted || room.hostId !== socket.id) return;
    if (room.players.length >= room.maxPlayers) return;

    const availableBot = BOT_NAMES.find(
      (b) => !room.players.some((p) => p.name === b.name)
    ) || { name: `Bot ${room.players.length + 1}`, avatarId: 'sharky' };

    const botId = `bot_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    room.players.push({
      id: botId,
      socketId: null,
      name: availableBot.name,
      avatarId: availableBot.avatarId,
      isHost: false,
      isReady: true,
      isBot: true,
      isDead: false,
      hand: [],
      disconnectedAt: null,
    });

    room.log(availableBot.name, availableBot.avatarId, 'was added as a bot.');
    room.broadcastLobby();
  });

  // 6. REMOVE BOT
  socket.on('remove_bot', ({ roomId, botId }) => {
    const room = rooms.get(roomId);
    if (!room || room.gameStarted || room.hostId !== socket.id) return;

    const idx = room.players.findIndex((p) => p.id === botId && p.isBot);
    if (idx !== -1) {
      const removed = room.players.splice(idx, 1)[0];
      room.log(removed.name, removed.avatarId, 'was removed.');
      room.broadcastLobby();
    }
  });

  // 7. KICK PLAYER
  socket.on('kick_player', ({ roomId, targetId }) => {
    const room = rooms.get(roomId);
    if (!room || room.gameStarted || room.hostId !== socket.id) return;

    const victim = room.players.find((p) => p.id === targetId);
    if (victim && !victim.isHost) {
      if (victim.socketId) {
        io.to(victim.socketId).emit('kicked');
      }
      room.players = room.players.filter((p) => p.id !== targetId);
      room.broadcastLobby();
    }
  });

  // 8. START GAME
  socket.on('start_game', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room || room.gameStarted || room.hostId !== socket.id) return;

    // Minimum 2 players to start
    if (room.players.length < 2) return;

    // All human players must be ready
    const allReady = room.players.every((p) => p.isReady || p.isBot);
    if (!allReady) return;

    room.setupGame();
  });

  // 9. GAMEPLAY: DRAW CARD
  socket.on('draw_card', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room || !room.gameStarted) return;
    room.drawCard(socket.id);
  });

  // 10. GAMEPLAY: PLAY CARD
  socket.on('play_card', ({ roomId, cardId, targetPlayerId, cardPairIds }) => {
    const room = rooms.get(roomId);
    if (!room || !room.gameStarted) return;

    if (cardPairIds && cardPairIds.length === 2 && targetPlayerId) {
      room.playCatPair(socket.id, cardPairIds, targetPlayerId);
      return;
    }

    if (targetPlayerId) {
      room.playFavor(socket.id, cardId, targetPlayerId);
      return;
    }

    room.playCard(socket.id, cardId);
  });

  // 11. DEFUSE KITTEN
  socket.on('defuse_kitten', ({ roomId, position }) => {
    const room = rooms.get(roomId);
    if (!room || !room.gameStarted) return;
    room.defuseKitten(socket.id, position);
  });

  // 12. ALTER THE FUTURE CONFIRM
  socket.on('reorder_future', ({ roomId, cardIds }) => {
    const room = rooms.get(roomId);
    if (!room || !room.gameStarted) return;
    room.reorderFuture(socket.id, cardIds);
  });

  // 13. FAVOR GIVE
  socket.on('favor_give', ({ roomId, cardId }) => {
    const room = rooms.get(roomId);
    if (!room || !room.gameStarted) return;
    room.resolveFavorGive(socket.id, cardId);
  });

  // 14. IN-GAME CHAT & EMOTES
  socket.on('send_chat', ({ roomId, message, emote }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const sender = room.players.find((p) => p.socketId === socket.id);
    if (!sender) return;

    io.to(roomId).emit('chat_message', {
      senderId: sender.id,
      senderName: sender.name,
      senderAvatar: sender.avatarId,
      message: (message || emote || '').slice(0, 50),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  });

  // 15. LEAVE ROOM
  socket.on('leave_room', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    socket.leave(roomId);
    socketToRoom.delete(socket.id);

    room.players = room.players.filter((p) => p.socketId !== socket.id);

    if (room.players.length === 0) {
      rooms.delete(roomId);
      return;
    }

    // Host migration
    if (room.hostId === socket.id) {
      const nextHost = room.players.find((p) => !p.isBot);
      if (nextHost) {
        room.hostId = nextHost.socketId;
        nextHost.isHost = true;
      }
    }

    room.broadcastLobby();
    if (room.gameStarted) {
      room.checkGameOver();
      room.broadcastGameState();
    }
  });

  // 16. DISCONNECT & 30-SEC GRACE PERIOD
  socket.on('disconnect', () => {
    const roomId = socketToRoom.get(socket.id);
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.players.find((p) => p.socketId === socket.id);
    if (!player) return;

    if (!room.gameStarted) {
      // In lobby: remove player immediately
      room.players = room.players.filter((p) => p.socketId !== socket.id);
      if (room.players.length === 0) {
        rooms.delete(roomId);
      } else {
        if (room.hostId === socket.id) {
          const nextHost = room.players.find((p) => !p.isBot);
          if (nextHost) {
            room.hostId = nextHost.socketId;
            nextHost.isHost = true;
          }
        }
        room.broadcastLobby();
      }
    } else {
      // In active game: 30-second grace period
      player.disconnectedAt = Date.now();
      room.log(player.name, player.avatarId, `${player.name} disconnected (holding seat for 30s)...`);
      room.broadcastGameState();

      setTimeout(() => {
        if (player.disconnectedAt && !player.isDead) {
          // If still disconnected after 30s, convert to an AI Bot to keep the game going smoothly
          player.isBot = true;
          player.disconnectedAt = null;
          room.log(player.name, player.avatarId, `${player.name} timed out and was replaced by AI bot.`);
          room.broadcastGameState();
          room.checkBotTurn();
        }
      }, 30000);
    }
  });
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Exploding Kittens Server running on port ${PORT}`);
});
