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
  // Danger Card
  COMBUSTION_CAT: {
    type: 'COMBUSTION_CAT',
    title: 'COMBUSTION CAT',
    subTitle: 'CRITICAL DETONATION',
    actionText: 'VAPORIZE IMMEDIATELY',
    funnySetup: 'A FELINE REACTOR CORE APPROACHING MAXIMUM VOLATILITY',
    bracketRule: '[ { EXPLODE: SHOW IMMEDIATELY. UNLESS YOU HAVE COOLANT FOAM, YOU ARE VAPORIZED. } ]',
    flavorText: 'Spontaneous feline detonation imminent! Defuse immediately or face catastrophic vaporisation.',
    category: 'danger',
    badgeColor: '#f97316',
    bgTone: '#1c1917',
    iconName: 'combustion_cat',
  },
  // Coolant Card
  COOLANT_FOAM: {
    type: 'COOLANT_FOAM',
    title: 'COOLANT FOAM',
    subTitle: 'CRYOGENIC EXTINGUISHER',
    actionText: 'NEUTRALIZE MELTDOWN',
    funnySetup: 'A SQUIRT GUN FILLED WITH CRYO-NITROGEN',
    bracketRule: '[ { DEFUSE: PLAY WHEN YOU DRAW A COMBUSTION CAT. SECRETLY RE-INSERT IT ANYWHERE IN THE DECK. } ]',
    flavorText: 'Douses the fiery feline with liquid nitrogen or catnip spray, allowing you to secretly replace the Combustion Cat anywhere in the deck.',
    category: 'defuse',
    badgeColor: '#10b981',
    bgTone: '#064e3b',
    iconName: 'coolant_foam',
  },
  // Action Cards
  THERMAL_BLAST: {
    type: 'THERMAL_BLAST',
    title: 'THERMAL BLAST',
    subTitle: 'REACTOR OVERHEAT',
    actionText: 'FORCE 2 TURNS',
    funnySetup: 'OVERHEAT THE REACTOR WITH 1,000 MICROWAVED BURRITOS',
    bracketRule: '[ { ATTACK: END TURN WITHOUT DRAWING. FORCES NEXT PLAYER TO TAKE 2 TURNS. } ]',
    flavorText: 'Unload thermal energy onto the next operator, forcing them to take 2 consecutive turns immediately.',
    category: 'action',
    badgeColor: '#ef4444',
    bgTone: '#450a0a',
    iconName: 'thermal_blast',
  },
  EMERGENCY_EVAC: {
    type: 'EMERGENCY_EVAC',
    title: 'EMERGENCY EVAC',
    subTitle: 'CRYO SHIELD VENT',
    actionText: 'ESCAPE TURN SAFELY',
    funnySetup: 'LAUNCH YOURSELF THROUGH THE VENTILATION DUCT',
    bracketRule: '[ { SKIP: IMMEDIATELY END 1 TURN WITHOUT DRAWING A CARD. } ]',
    flavorText: 'Trigger instant emergency cooling and escape your turn without drawing a card.',
    category: 'action',
    badgeColor: '#06b6d4',
    bgTone: '#083344',
    iconName: 'emergency_evac',
  },
  INFRARED_SCAN: {
    type: 'INFRARED_SCAN',
    title: 'INFRARED SCAN',
    subTitle: 'THERMAL SURVEILLANCE',
    actionText: 'SCAN TOP 3 CORE CARDS',
    funnySetup: 'A THERMAL SATELLITE PEERS INTO THE FUEL CHAMBER',
    bracketRule: '[ { SEE THE FUTURE: PRIVATELY VIEW THE TOP 3 CARDS OF THE DECK. } ]',
    flavorText: 'Scan the top 3 cards of the reactor draw core with thermal cameras.',
    category: 'action',
    badgeColor: '#8b5cf6',
    bgTone: '#2e1065',
    iconName: 'infrared_scan',
  },
  TIMELINE_SCRAMBLE: {
    type: 'TIMELINE_SCRAMBLE',
    title: 'TIMELINE SCRAMBLE',
    subTitle: 'REACTOR OVERHAUL',
    actionText: 'REORDER TOP 3 CARDS',
    funnySetup: 'BEND QUANTUM SPACE-TIME WITH A RUBBER BAND',
    bracketRule: '[ { ALTER THE FUTURE: VIEW AND REARRANGE THE TOP 3 CARDS IN ANY ORDER. } ]',
    flavorText: 'Peer into the top 3 cards and manipulate their containment sequence.',
    category: 'action',
    badgeColor: '#d946ef',
    bgTone: '#4a044e',
    iconName: 'timeline_scramble',
  },
  THERMODYNAMIC_VORTEX: {
    type: 'THERMODYNAMIC_VORTEX',
    title: 'THERMODYNAMIC VORTEX',
    subTitle: 'CENTRIFUGE AGITATION',
    actionText: 'RANDOMIZE DRAW CORE',
    funnySetup: 'AN AGITATED CAT RUNS ON THE CENTRIFUGE WHEEL',
    bracketRule: '[ { SHUFFLE: THOROUGHLY RANDOMIZE THE ENTIRE FUEL DECK. } ]',
    flavorText: 'Activate the magnetic centrifuge to completely randomize the draw pile.',
    category: 'action',
    badgeColor: '#64748b',
    bgTone: '#0f172a',
    iconName: 'thermodynamic_vortex',
  },
  FELINE_BLACKMAIL: {
    type: 'FELINE_BLACKMAIL',
    title: 'FELINE BLACKMAIL',
    subTitle: 'HAZARD EXTORTION',
    actionText: 'FORCE 1 CARD BRIBE',
    funnySetup: 'THREATEN RIVALS WITH AN UNCOMFORTABLY LONG STARE',
    bracketRule: '[ { FAVOR: FORCE ANY RIVAL PLAYER TO GIVE YOU 1 CARD OF THEIR CHOICE. } ]',
    flavorText: 'Threaten another lab technician with a meltdown to extort 1 card from their hand.',
    category: 'action',
    badgeColor: '#eab308',
    bgTone: '#422006',
    iconName: 'feline_blackmail',
  },
  NOPE: {
    type: 'NOPE',
    title: 'NOPE',
    subTitle: 'STOP ACTION',
    actionText: 'CANCEL OPPONENT ACTION',
    funnySetup: 'A JACKANOPE BOUNDS INTO THE ROOM',
    bracketRule: '[ { NOPE: STOP THE ACTION OF ANOTHER PLAYER. CAN BE PLAYED AT ANY TIME. } ]',
    flavorText: 'Stop the action of another player. Can be played at any time.',
    category: 'action',
    badgeColor: '#dc2626',
    bgTone: '#450a0a',
    iconName: 'nope',
  },
  // 5 Feral Feline Combo Cards
  CAT_STATIC_SPARK: {
    type: 'CAT_STATIC_SPARK',
    title: 'STATIC SPARK CAT',
    subTitle: 'TESLA COIL FUR',
    actionText: 'PAIR TO STEAL',
    funnySetup: 'RUBBED AGAINST 500 WOOL SWEATERS IN DRY WEATHER',
    bracketRule: '[ { COMBO ONLY: NO EFFECT ALONE. PLAY 2 TO STEAL, 3 TO DEMAND A CARD, OR 5 TO LOOT DISCARD. } ]',
    flavorText: 'High-voltage friction crackling from its paws. Pair 2 to steal a random card.',
    category: 'cat',
    badgeColor: '#f59e0b',
    bgTone: '#451a03',
    iconName: 'cat_static',
  },
  CAT_NUCLEAR_NACHO: {
    type: 'CAT_NUCLEAR_NACHO',
    title: 'NUCLEAR NACHO CAT',
    subTitle: 'RADIOACTIVE SNACK',
    actionText: 'PAIR TO STEAL',
    funnySetup: 'CRUNCHING ON GLOWING ISOTOPE-DIPPED TORTILLA CHIPS',
    bracketRule: '[ { COMBO ONLY: NO EFFECT ALONE. PLAY 2 TO STEAL, 3 TO DEMAND A CARD, OR 5 TO LOOT DISCARD. } ]',
    flavorText: 'Irradiated cheese dust radiating lethal gamma warmth. Pair 2 to steal a random card.',
    category: 'cat',
    badgeColor: '#84cc16',
    bgTone: '#1a2e05',
    iconName: 'cat_nuclear',
  },
  CAT_PLASMA_PURR: {
    type: 'CAT_PLASMA_PURR',
    title: 'PLASMA PURR CAT',
    subTitle: 'SUPERHEATED ION BEAM',
    actionText: 'PAIR TO STEAL',
    funnySetup: 'PURRING AT 40,000 KELVIN WITH VIOLET ION DISCHARGE',
    bracketRule: '[ { COMBO ONLY: NO EFFECT ALONE. PLAY 2 TO STEAL, 3 TO DEMAND A CARD, OR 5 TO LOOT DISCARD. } ]',
    flavorText: 'Vibrates at 40,000 kelvin with luminous violet discharge. Pair 2 to steal a random card.',
    category: 'cat',
    badgeColor: '#ec4899',
    bgTone: '#500724',
    iconName: 'cat_plasma',
  },
  CAT_VOLCANO_WHISKER: {
    type: 'CAT_VOLCANO_WHISKER',
    title: 'VOLCANO WHISKER CAT',
    subTitle: 'MAGMA PLUME SNOUT',
    actionText: 'PAIR TO STEAL',
    funnySetup: 'SNEEZING MOLTEN BASALT AND BUBBLING OBSIDIAN',
    bracketRule: '[ { COMBO ONLY: NO EFFECT ALONE. PLAY 2 TO STEAL, 3 TO DEMAND A CARD, OR 5 TO LOOT DISCARD. } ]',
    flavorText: 'Bristles with molten obsidian and bubbling basalt. Pair 2 to steal a random card.',
    category: 'cat',
    badgeColor: '#ea580c',
    bgTone: '#431407',
    iconName: 'cat_volcano',
  },
  CAT_TICKING_TABBY: {
    type: 'CAT_TICKING_TABBY',
    title: 'TICKING TABBY',
    subTitle: 'CHRONO CLOCKWORK',
    actionText: 'PAIR TO STEAL',
    funnySetup: 'AN INTRICATE CLOCKWORK MECHANISM COUNTING DOWN TO BOOM',
    bracketRule: '[ { COMBO ONLY: NO EFFECT ALONE. PLAY 2 TO STEAL, 3 TO DEMAND A CARD, OR 5 TO LOOT DISCARD. } ]',
    flavorText: 'Gears grinding and counting down to spontaneous ignition. Pair 2 to steal a random card.',
    category: 'cat',
    badgeColor: '#10b981',
    bgTone: '#022c22',
    iconName: 'cat_tabby',
  },
};

// Aliases for backwards compatibility with any legacy client checks
CARD_TEMPLATES.EXPLODING_KITTEN = CARD_TEMPLATES.COMBUSTION_CAT;
CARD_TEMPLATES.DEFUSE = CARD_TEMPLATES.COOLANT_FOAM;
CARD_TEMPLATES.ATTACK = CARD_TEMPLATES.THERMAL_BLAST;
CARD_TEMPLATES.SKIP = CARD_TEMPLATES.EMERGENCY_EVAC;
CARD_TEMPLATES.SEE_THE_FUTURE = CARD_TEMPLATES.INFRARED_SCAN;
CARD_TEMPLATES.ALTER_THE_FUTURE = CARD_TEMPLATES.TIMELINE_SCRAMBLE;
CARD_TEMPLATES.SHUFFLE = CARD_TEMPLATES.THERMODYNAMIC_VORTEX;
CARD_TEMPLATES.FAVOR = CARD_TEMPLATES.FELINE_BLACKMAIL;
CARD_TEMPLATES.CAT_TACOCAT = CARD_TEMPLATES.CAT_STATIC_SPARK;
CARD_TEMPLATES.CAT_HAIRY_POTATO = CARD_TEMPLATES.CAT_NUCLEAR_NACHO;
CARD_TEMPLATES.CAT_RAINBOW_RALPHING = CARD_TEMPLATES.CAT_PLASMA_PURR;
CARD_TEMPLATES.CAT_BEARD = CARD_TEMPLATES.CAT_VOLCANO_WHISKER;
CARD_TEMPLATES.CAT_CATTERMELON = CARD_TEMPLATES.CAT_TICKING_TABBY;

let globalCardSeq = 0;
function createCard(type) {
  globalCardSeq++;
  const def = CARD_TEMPLATES[type] || CARD_TEMPLATES.COMBUSTION_CAT;
  return {
    ...def,
    id: `c_${def.type}_${globalCardSeq}_${Math.random().toString(36).substr(2, 6)}`,
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
  { name: 'Dr. Singe', avatarId: 'dr_singe' },
  { name: 'Sizzles', avatarId: 'sizzles' },
  { name: 'Pyro-Paw', avatarId: 'pyro_paw' },
  { name: 'Meltdown Max', avatarId: 'meltdown_max' },
  { name: 'Ash-Tail', avatarId: 'ash_tail' },
  { name: 'Sharky', avatarId: 'sharky' },
  { name: 'Bacon Cat', avatarId: 'bacon_cat' },
];

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'CAT-';
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
    this.turnCountTotal = 0;
    this.actionLog = [];
    this.turnState = 'NORMAL'; // 'NORMAL' | 'AWAITING_DEFUSE' | 'AWAITING_FAVOR' | 'ALTERING_FUTURE' | 'SELECTING_DISCARD'
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
    const kittensInDeck = this.drawPile.filter((c) => c.type === 'COMBUSTION_CAT' || c.type === 'EXPLODING_KITTEN').length;
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
        turnCountTotal: this.turnCountTotal,
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
    this.turnCountTotal = 0;
    this.discardPile = [];
    this.botKnownTopCards = {};
    clearTimeout(this.botTimer);

    // 1. Build standard pool
    const pool = [];
    const counts = [
      { type: 'THERMAL_BLAST', count: 4 },
      { type: 'EMERGENCY_EVAC', count: 4 },
      { type: 'INFRARED_SCAN', count: 5 },
      { type: 'TIMELINE_SCRAMBLE', count: 3 },
      { type: 'FELINE_BLACKMAIL', count: 4 },
      { type: 'THERMODYNAMIC_VORTEX', count: 4 },
      { type: 'CAT_STATIC_SPARK', count: 4 },
      { type: 'CAT_NUCLEAR_NACHO', count: 4 },
      { type: 'CAT_PLASMA_PURR', count: 4 },
      { type: 'CAT_VOLCANO_WHISKER', count: 4 },
      { type: 'CAT_TICKING_TABBY', count: 4 },
    ];

    counts.forEach((item) => {
      for (let i = 0; i < item.count; i++) {
        pool.push(createCard(item.type));
      }
    });

    const shuffledPool = shuffle(pool);

    // 2. Deal 1 Coolant Foam and 4 random cards to each player
    const playerCount = this.players.length;
    const defuses = [];
    // 6 coolant foams total in standard deck
    for (let i = 0; i < 6; i++) {
      defuses.push(createCard('COOLANT_FOAM'));
    }

    let poolIdx = 0;
    this.players.forEach((player, idx) => {
      player.isDead = false;
      player.hand = [];
      // 1 Coolant Foam
      player.hand.push(defuses[idx]);
      // 4 random cards
      for (let c = 0; c < 4; c++) {
        player.hand.push(shuffledPool[poolIdx++]);
      }
    });

    // 3. Assemble Draw Deck:
    // (Player Count - 1) Combustion Cats + remaining Coolants + remaining pool
    const combustionCatsCount = Math.max(1, playerCount - 1);
    const combustionCats = [];
    for (let k = 0; k < combustionCatsCount; k++) {
      combustionCats.push(createCard('COMBUSTION_CAT'));
    }

    const leftoverDefuses = defuses.slice(playerCount);
    const leftoverPool = shuffledPool.slice(poolIdx);

    this.drawPile = shuffle([...leftoverPool, ...leftoverDefuses, ...combustionCats]);

    this.log('GAME', 'player', 'Reactor ignited! Hands dealt. Beware of Combustion Cats!');
    this.broadcastLobby();
    this.broadcastGameState();

    this.checkBotTurn();
  }

  advanceTurn(newTurns = 1) {
    clearTimeout(this.botTimer);
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
    this.turnsRemaining = Math.max(1, newTurns);
    this.turnCountTotal++;
    this.turnState = 'NORMAL';
    this.turnStateData = null;

    const nextP = this.players[nextIdx];
    this.log(
      nextP.name,
      nextP.avatarId,
      `${nextP.name}'s turn (${newTurns} turn${newTurns > 1 ? 's' : ''} to take)`
    );

    // Bot reaction to thermal attack (multiple turns)
    if (nextP && nextP.isBot && newTurns > 1) {
      const reactions = [
        '😱 Double shifts?! Why me?!',
        '🔥 That is uncalled for!',
        '😼 Challenge accepted!',
        '💣 You will pay for this!',
        '⚡ Thermal overload incoming!'
      ];
      const botMsg = reactions[Math.floor(Math.random() * reactions.length)];
      setTimeout(() => {
        io.to(this.id).emit('chat_message', {
          senderId: nextP.id,
          senderName: nextP.name,
          senderAvatar: nextP.avatarId,
          message: botMsg,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }, 400);
    }

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

    const kittensInDeck = this.drawPile.filter((c) => c.type === 'COMBUSTION_CAT' || c.type === 'EXPLODING_KITTEN').length;
    const chance = (kittensInDeck / this.drawPile.length) * 100;
    const knownTop = this.botKnownTopCards[bot.id];
    const topIsKitten = knownTop && (knownTop[0]?.type === 'COMBUSTION_CAT' || knownTop[0]?.type === 'EXPLODING_KITTEN');

    const alterFuture = bot.hand.find((c) => c.type === 'TIMELINE_SCRAMBLE' || c.type === 'ALTER_THE_FUTURE');
    const attack = bot.hand.find((c) => c.type === 'THERMAL_BLAST' || c.type === 'ATTACK');
    const skip = bot.hand.find((c) => c.type === 'EMERGENCY_EVAC' || c.type === 'SKIP');
    const seeFuture = bot.hand.find((c) => c.type === 'INFRARED_SCAN' || c.type === 'SEE_THE_FUTURE');
    const shuffleCard = bot.hand.find((c) => c.type === 'THERMODYNAMIC_VORTEX' || c.type === 'SHUFFLE');
    const favor = bot.hand.find((c) => c.type === 'FELINE_BLACKMAIL' || c.type === 'FAVOR');

    // Card type counts in bot hand
    const typeCounts = {};
    bot.hand.forEach((c) => {
      typeCounts[c.type] = typeCounts[c.type] || [];
      typeCounts[c.type].push(c);
    });

    const trioType = Object.keys(typeCounts).find((k) => typeCounts[k].length >= 3);
    const pairType = Object.keys(typeCounts).find((k) => typeCounts[k].length >= 2);

    // Evasion if cat is next or chance is high
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

    // 3-of-a-kind combo demand
    if (trioType && Math.random() < 0.75) {
      const trio = typeCounts[trioType].slice(0, 3);
      const targets = this.players.filter(
        (p) => p.id !== bot.id && !p.isDead && p.hand.length > 0
      );
      if (targets.length > 0) {
        targets.sort((a, b) => b.hand.length - a.hand.length);
        this.playThreeOfAKind(bot.id, trio.map((c) => c.id), targets[0].id, 'COOLANT_FOAM');
        return;
      }
    }

    // 5-different cards discard retrieval (if discard has valuable Coolant or Thermal Blast)
    const distinctTypes = Object.keys(typeCounts);
    if (distinctTypes.length >= 5 && Math.random() < 0.65) {
      const hasValuableInDiscard = this.discardPile.some(
        (c) => c.type === 'COOLANT_FOAM' || c.type === 'DEFUSE' || c.type === 'THERMAL_BLAST' || c.type === 'ATTACK'
      );
      if (hasValuableInDiscard) {
        const fiveCards = distinctTypes.slice(0, 5).map((t) => typeCounts[t][0]);
        this.playFiveDifferent(bot.id, fiveCards.map((c) => c.id));
        return;
      }
    }

    // 2-of-a-kind pair combo steal
    if (pairType && Math.random() < 0.6) {
      const pair = typeCounts[pairType].slice(0, 2);
      const targets = this.players.filter(
        (p) => p.id !== bot.id && !p.isDead && p.hand.length > 0
      );
      if (targets.length > 0) {
        targets.sort((a, b) => b.hand.length - a.hand.length);
        this.playPair(bot.id, pair.map((c) => c.id), targets[0].id);
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

    if (drawnCard.type === 'COMBUSTION_CAT' || drawnCard.type === 'EXPLODING_KITTEN') {
      const defuseIdx = currentP.hand.findIndex((c) => c.type === 'COOLANT_FOAM' || c.type === 'DEFUSE');

      if (defuseIdx !== -1) {
        // Player has Coolant Foam / Defuse!
        const defuseCard = currentP.hand.splice(defuseIdx, 1)[0];
        this.discardPile.push(defuseCard);
        this.matchStats.kittensDefused++;

        this.log(
          currentP.name,
          currentP.avatarId,
          `DREW A COMBUSTION CAT but doused the core with ${defuseCard.title}!`
        );

        io.to(this.id).emit('kitten_defused', {
          playerId: currentP.id,
          playerName: currentP.name,
          card: defuseCard,
        });

        if (currentP.isBot) {
          // Bot places cat secretly (35% top, 50% random, 15% bottom)
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
          // Human player must choose where to put the cat
          this.turnState = 'AWAITING_DEFUSE';
          this.turnStateData = {
            kittenCard: drawnCard,
            targetSocketId: currentP.socketId,
          };
          this.broadcastGameState();
        }
      } else {
        // NO COOLANT -> MELTDOWN!
        this.log(
          currentP.name,
          currentP.avatarId,
          `💥 MELTDOWN! ${currentP.name} drew a Combustion Cat with NO COOLANT and vaporised!`
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
    this.log(currentP.name, currentP.avatarId, `drew a card from the reactor core.`);

    io.to(this.id).emit('card_drawn', {
      playerId: currentP.id,
      playerName: currentP.name,
    });

    // Bot occasional banter if drawing safely under high tension
    const kittenCount = this.drawPile.filter((c) => c.type === 'COMBUSTION_CAT' || c.type === 'EXPLODING_KITTEN').length;
    const chance = this.drawPile.length > 0 ? (kittenCount / this.drawPile.length) * 100 : 0;
    if (currentP.isBot && chance > 22 && Math.random() < 0.4) {
      const safeReactions = [
        '😅 Phew! Still in one piece!',
        '😼 Too cool to explode!',
        '❄️ Temperature under control!',
        '🧊 Crisis avoided!'
      ];
      const botMsg = safeReactions[Math.floor(Math.random() * safeReactions.length)];
      setTimeout(() => {
        io.to(this.id).emit('chat_message', {
          senderId: currentP.id,
          senderName: currentP.name,
          senderAvatar: currentP.avatarId,
          message: botMsg,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }, 300);
    }

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

    const kittenCard = this.turnStateData?.kittenCard || createCard('COMBUSTION_CAT');

    if (position === 'top' || position === 0) {
      this.drawPile.unshift(kittenCard);
      this.log(currentP.name, currentP.avatarId, 'secretly armed the Combustion Cat back on TOP of the deck!');
    } else if (position === 'bottom') {
      this.drawPile.push(kittenCard);
      this.log(currentP.name, currentP.avatarId, 'secretly slid the Combustion Cat to the BOTTOM of the deck.');
    } else if (position === 'random') {
      const pos = Math.floor(Math.random() * (this.drawPile.length + 1));
      this.drawPile.splice(pos, 0, kittenCard);
      this.log(currentP.name, currentP.avatarId, 'secretly shuffled the Combustion Cat into a random core chamber.');
    } else if (typeof position === 'number') {
      const clamped = Math.max(0, Math.min(this.drawPile.length, position));
      this.drawPile.splice(clamped, 0, kittenCard);
      this.log(currentP.name, currentP.avatarId, `secretly placed the Combustion Cat at chamber #${clamped + 1}.`);
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
      case 'THERMAL_BLAST':
      case 'ATTACK': {
        this.matchStats.attacksPlayed++;
        const nextTurns = (this.turnsRemaining > 1 ? this.turnsRemaining : 0) + 2;
        this.log(
          currentP.name,
          currentP.avatarId,
          `unleashed ${card.title}! Next operator must endure ${nextTurns} consecutive turns!`,
          card.type
        );
        this.advanceTurn(nextTurns);
        break;
      }

      case 'EMERGENCY_EVAC':
      case 'SKIP': {
        this.log(
          currentP.name,
          currentP.avatarId,
          `triggered ${card.title} and escaped safely!`,
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

      case 'INFRARED_SCAN':
      case 'SEE_THE_FUTURE': {
        const top3 = this.drawPile.slice(0, 3);
        this.log(
          currentP.name,
          currentP.avatarId,
          `activated ${card.title} to scan the top 3 cards!`,
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

      case 'TIMELINE_SCRAMBLE':
      case 'ALTER_THE_FUTURE': {
        const top3 = this.drawPile.slice(0, 3);
        this.log(
          currentP.name,
          currentP.avatarId,
          `activated ${card.title} and is manipulating the sequence!`,
          card.type
        );

        if (currentP.isBot) {
          if (top3.length > 1 && (top3[0].type === 'COMBUSTION_CAT' || top3[0].type === 'EXPLODING_KITTEN')) {
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

      case 'THERMODYNAMIC_VORTEX':
      case 'SHUFFLE': {
        this.drawPile = shuffle(this.drawPile);
        this.botKnownTopCards = {};
        this.log(
          currentP.name,
          currentP.avatarId,
          `activated ${card.title} and thoroughly agitated the core deck!`,
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

    io.to(this.id).emit('card_played', {
      playerId: currentP.id,
      playerName: currentP.name,
      card,
    });

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

  // 2-OF-A-KIND (PAIR) COMBO: Steal random card
  playPair(playerId, pairCardIds, targetPlayerId) {
    const currentP = this.players[this.activePlayerIndex];
    const victim = this.players.find((p) => p.id === targetPlayerId);
    if (!currentP || currentP.id !== playerId || this.turnState !== 'NORMAL' || !victim || victim.isDead || victim.hand.length === 0)
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
      `played a pair of ${cardsToPlay[0].title}s and STOLE a random card from ${victim.name}!`
    );

    io.to(this.id).emit('combo_result', {
      type: 'PAIR',
      success: true,
      attackerId: currentP.id,
      attackerName: currentP.name,
      victimId: victim.id,
      victimName: victim.name,
      cardTitle: cardsToPlay[0].title,
      cards: cardsToPlay,
    });

    this.broadcastGameState();
    this.checkBotTurn();
  }

  // Backwards compatibility alias
  playCatPair(playerId, pairCardIds, targetPlayerId) {
    return this.playPair(playerId, pairCardIds, targetPlayerId);
  }

  // 3-OF-A-KIND COMBO: Targeted Card Demand
  playThreeOfAKind(playerId, cardIds, targetPlayerId, demandedCardType) {
    const currentP = this.players[this.activePlayerIndex];
    const victim = this.players.find((p) => p.id === targetPlayerId);
    if (!currentP || currentP.id !== playerId || this.turnState !== 'NORMAL' || !victim || victim.isDead || victim.hand.length === 0)
      return;

    const cardsToPlay = currentP.hand.filter((c) => cardIds.includes(c.id));
    if (cardsToPlay.length !== 3) return;
    if (cardsToPlay[0].type !== cardsToPlay[1].type || cardsToPlay[1].type !== cardsToPlay[2].type) return;

    currentP.hand = currentP.hand.filter((c) => !cardIds.includes(c.id));
    this.discardPile.push(...cardsToPlay);

    const demandedIndex = victim.hand.findIndex((c) => c.type === demandedCardType);
    const demandedTemplate = CARD_TEMPLATES[demandedCardType] || { title: demandedCardType };

    if (demandedIndex !== -1) {
      const stolenCard = victim.hand.splice(demandedIndex, 1)[0];
      currentP.hand.push(stolenCard);
      this.matchStats.cardsStolen++;

      this.log(
        currentP.name,
        currentP.avatarId,
        `🎯 3-OF-A-KIND SUCCESS! Demanded ${demandedTemplate.title} from ${victim.name} and stole it!`
      );

      io.to(this.id).emit('combo_result', {
        type: 'THREE_OF_A_KIND',
        success: true,
        attackerId: currentP.id,
        attackerName: currentP.name,
        victimId: victim.id,
        victimName: victim.name,
        cardTitle: cardsToPlay[0].title,
        demandedTitle: demandedTemplate.title,
        cards: cardsToPlay,
      });
    } else {
      this.log(
        currentP.name,
        currentP.avatarId,
        `❌ 3-OF-A-KIND MISSED! Demanded ${demandedTemplate.title} from ${victim.name}, but they had none!`
      );

      io.to(this.id).emit('combo_result', {
        type: 'THREE_OF_A_KIND',
        success: false,
        attackerId: currentP.id,
        attackerName: currentP.name,
        victimId: victim.id,
        victimName: victim.name,
        cardTitle: cardsToPlay[0].title,
        demandedTitle: demandedTemplate.title,
        cards: cardsToPlay,
      });
    }

    this.broadcastGameState();
    this.checkBotTurn();
  }

  // 5-DIFFERENT COMBO: Discard Pile Retrieval
  playFiveDifferent(playerId, cardIds) {
    const currentP = this.players[this.activePlayerIndex];
    if (!currentP || currentP.id !== playerId || this.turnState !== 'NORMAL') return;

    const cardsToPlay = currentP.hand.filter((c) => cardIds.includes(c.id));
    if (cardsToPlay.length !== 5) return;

    const types = new Set(cardsToPlay.map((c) => c.type));
    if (types.size !== 5) return;

    // Discard the 5 played cards
    currentP.hand = currentP.hand.filter((c) => !cardIds.includes(c.id));
    this.discardPile.push(...cardsToPlay);

    this.log(
      currentP.name,
      currentP.avatarId,
      `✨ 5-CARD COMBO! ${currentP.name} played 5 different cards to scavenge the Discard Pile!`
    );

    io.to(this.id).emit('combo_result', {
      type: 'FIVE_DIFFERENT',
      success: true,
      attackerId: currentP.id,
      attackerName: currentP.name,
      cardTitle: '5-Card Lab Combo',
      cards: cardsToPlay,
    });

    if (currentP.isBot) {
      const eligible = this.discardPile.filter((c) => c.type !== 'COMBUSTION_CAT' && c.type !== 'EXPLODING_KITTEN');
      if (eligible.length > 0) {
        const priorityOrder = ['COOLANT_FOAM', 'DEFUSE', 'THERMAL_BLAST', 'ATTACK', 'TIMELINE_SCRAMBLE', 'ALTER_THE_FUTURE', 'INFRARED_SCAN', 'SEE_THE_FUTURE', 'EMERGENCY_EVAC', 'SKIP', 'FELINE_BLACKMAIL', 'FAVOR'];
        let chosen = null;
        for (const pType of priorityOrder) {
          chosen = eligible.find((c) => c.type === pType);
          if (chosen) break;
        }
        if (!chosen) chosen = eligible[0];

        const cIdx = this.discardPile.findIndex((c) => c.id === chosen.id);
        if (cIdx !== -1) {
          const recovered = this.discardPile.splice(cIdx, 1)[0];
          currentP.hand.push(recovered);
          this.log(currentP.name, currentP.avatarId, `retrieved ${recovered.title} from the discard pile.`);
        }
      }
      this.broadcastGameState();
      this.checkBotTurn();
    } else {
      this.turnState = 'SELECTING_DISCARD';
      this.turnStateData = {
        requesterId: currentP.id,
        requesterSocketId: currentP.socketId,
      };
      io.to(currentP.socketId).emit('open_discard_browser', {
        discardPile: this.discardPile.filter((c) => c.type !== 'COMBUSTION_CAT' && c.type !== 'EXPLODING_KITTEN'),
      });
      this.broadcastGameState();
    }
  }

  // SELECT CARD FROM DISCARD PILE
  selectDiscardCard(playerId, cardId) {
    if (this.turnState !== 'SELECTING_DISCARD') return;
    const currentP = this.players[this.activePlayerIndex];
    if (!currentP || currentP.id !== playerId) return;

    const idx = this.discardPile.findIndex((c) => c.id === cardId && c.type !== 'COMBUSTION_CAT' && c.type !== 'EXPLODING_KITTEN');
    if (idx === -1) return;

    const card = this.discardPile.splice(idx, 1)[0];
    currentP.hand.push(card);

    this.log(currentP.name, currentP.avatarId, `retrieved ${card.title} from the Discard Pile!`);

    this.turnState = 'NORMAL';
    this.turnStateData = null;
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
  socket.on('play_card', ({ roomId, cardId, targetPlayerId, cardPairIds, comboType, cardIds, demandedCardType }) => {
    const room = rooms.get(roomId);
    if (!room || !room.gameStarted) return;

    // Direct combo invocations
    if (comboType === 'THREE_OF_A_KIND' && cardIds && targetPlayerId && demandedCardType) {
      room.playThreeOfAKind(socket.id, cardIds, targetPlayerId, demandedCardType);
      return;
    }

    if (comboType === 'FIVE_DIFFERENT' && cardIds) {
      room.playFiveDifferent(socket.id, cardIds);
      return;
    }

    if (cardPairIds && cardPairIds.length === 2 && targetPlayerId) {
      room.playPair(socket.id, cardPairIds, targetPlayerId);
      return;
    }

    if (targetPlayerId) {
      room.playFavor(socket.id, cardId, targetPlayerId);
      return;
    }

    room.playCard(socket.id, cardId);
  });

  // 10b. GAMEPLAY: PLAY COMBO
  socket.on('play_combo', ({ roomId, comboType, cardIds, targetPlayerId, demandedCardType }) => {
    const room = rooms.get(roomId);
    if (!room || !room.gameStarted) return;

    if (comboType === 'PAIR' || comboType === 'TWO_OF_A_KIND') {
      room.playPair(socket.id, cardIds, targetPlayerId);
    } else if (comboType === 'THREE_OF_A_KIND') {
      room.playThreeOfAKind(socket.id, cardIds, targetPlayerId, demandedCardType);
    } else if (comboType === 'FIVE_DIFFERENT') {
      room.playFiveDifferent(socket.id, cardIds);
    }
  });

  // 10c. GAMEPLAY: SELECT DISCARD CARD (for 5-Card Combo)
  socket.on('select_discard_card', ({ roomId, cardId }) => {
    const room = rooms.get(roomId);
    if (!room || !room.gameStarted) return;
    room.selectDiscardCard(socket.id, cardId);
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

  // 14b. AVATAR REACTION / SPEECH BUBBLE
  socket.on('send_reaction', ({ roomId, reactionText }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const sender = room.players.find((p) => p.socketId === socket.id);
    if (!sender) return;

    io.to(roomId).emit('player_reacted', {
      playerId: sender.id,
      reactionText: (reactionText || '').slice(0, 30),
      playerName: sender.name,
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
