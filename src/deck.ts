import { Card, CardType } from './types';

export const CARD_DEFINITIONS: Record<string, Omit<Card, 'id'>> = {
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
  DEFUSE_LASER: {
    type: 'DEFUSE',
    title: 'LASER POINTER',
    subTitle: 'OF GREAT CAT JUSTICE',
    actionText: 'DEFUSE EXPLOSION',
    flavorText: 'Distract the kitten and place it anywhere secretly in the deck.',
    category: 'defuse',
    badgeColor: '#22c55e',
    bgTone: '#dcfce7',
    iconName: 'laser',
  },
  DEFUSE_BANJO: {
    type: 'DEFUSE',
    title: 'KITTEN BANJO',
    subTitle: 'SWEET MOUNTAIN TUNE',
    actionText: 'DEFUSE EXPLOSION',
    flavorText: 'Soothe the radioactive beast with a whimsical acoustic breakdown.',
    category: 'defuse',
    badgeColor: '#22c55e',
    bgTone: '#dcfce7',
    iconName: 'banjo',
  },
  DEFUSE_CATNIP: {
    type: 'DEFUSE',
    title: 'CATNIP SANDWICH',
    subTitle: 'ORGANIC RELIEF',
    actionText: 'DEFUSE EXPLOSION',
    flavorText: 'An irresistible herb bundle to pacify demonic feline fury.',
    category: 'defuse',
    badgeColor: '#22c55e',
    bgTone: '#dcfce7',
    iconName: 'sandwich',
  },
  ATTACK_SINGLE: {
    type: 'ATTACK',
    title: 'SINGLE SLAP',
    subTitle: 'TIGER PAW STRIKE',
    actionText: 'END TURN & STACK 2 TURNS',
    flavorText: 'End your turn without drawing and force the next victim to take 2 turns!',
    category: 'action',
    badgeColor: '#ea580c',
    bgTone: '#ffedd5',
    iconName: 'paw',
  },
  ATTACK_DOUBLE: {
    type: 'ATTACK',
    title: 'DOUBLE SLAP',
    subTitle: 'BEAR-O-DACTYL CLAW',
    actionText: 'END TURN & STACK 2 TURNS',
    flavorText: 'Direct incoming fury to the next player with twice the vengeance.',
    category: 'action',
    badgeColor: '#ea580c',
    bgTone: '#ffedd5',
    iconName: 'claws',
  },
  SKIP_SPRINT: {
    type: 'SKIP',
    title: 'SPRINT AWAY',
    subTitle: 'FROM THE PREMISES',
    actionText: 'END TURN WITHOUT DRAWING',
    flavorText: 'Immediately end your turn without drawing a card. Safe for now!',
    category: 'action',
    badgeColor: '#3b82f6',
    bgTone: '#dbeafe',
    iconName: 'run',
  },
  SKIP_PORTAL: {
    type: 'SKIP',
    title: 'BUNNY HOLE',
    subTitle: 'TACTICAL RETREAT',
    actionText: 'END TURN WITHOUT DRAWING',
    flavorText: 'Dive through an underground burrow straight past your turn.',
    category: 'action',
    badgeColor: '#3b82f6',
    bgTone: '#dbeafe',
    iconName: 'rabbit',
  },
  SEE_FUTURE_1: {
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
  SEE_FUTURE_2: {
    type: 'SEE_THE_FUTURE',
    title: 'RECON SLOTH',
    subTitle: 'FUTURE BINOCULARS',
    actionText: 'PEEK TOP 3 CARDS',
    flavorText: 'Deploy the reconnaissance sloth to peer over the impending doom.',
    category: 'action',
    badgeColor: '#9333ea',
    bgTone: '#f3e8ff',
    iconName: 'binoculars',
  },
  ALTER_FUTURE: {
    type: 'ALTER_THE_FUTURE',
    title: 'ALTER THE FUTURE',
    subTitle: 'TEMPORAL VORTEX',
    actionText: 'REORDER TOP 3 CARDS',
    flavorText: 'Peek at the top 3 cards and rearrange them in any sequence you desire!',
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
    flavorText: 'Select an opponent. They must voluntarily hand you 1 card from their hand.',
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
    flavorText: 'Plays as a matching combo. Play a pair to steal a random card from any player.',
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

/**
 * Shuffle array using Fisher-Yates
 */
export function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

let cardCounter = 0;
export function createCardInstance(key: keyof typeof CARD_DEFINITIONS): Card {
  cardCounter++;
  const def = CARD_DEFINITIONS[key];
  return {
    ...def,
    id: `card_${key}_${cardCounter}_${Math.random().toString(36).substr(2, 5)}`,
  };
}

/**
 * Setup a standard 4-player game deck:
 * - 4 players each get 1 Defuse + 4 random standard cards (5 total).
 * - Remaining deck receives 3 Exploding Kittens + remaining Defuses (typically 2 leftover from a 6-defuse pool).
 * - Deck is shuffled.
 */
export function initializeGameDecks() {
  const nonDangerPool: Card[] = [];

  // Distribution of action cards and cats:
  const distribution: Array<{ key: keyof typeof CARD_DEFINITIONS; count: number }> = [
    { key: 'ATTACK_SINGLE', count: 3 },
    { key: 'ATTACK_DOUBLE', count: 2 },
    { key: 'SKIP_SPRINT', count: 3 },
    { key: 'SKIP_PORTAL', count: 2 },
    { key: 'SEE_FUTURE_1', count: 3 },
    { key: 'SEE_FUTURE_2', count: 2 },
    { key: 'ALTER_FUTURE', count: 3 },
    { key: 'FAVOR', count: 4 },
    { key: 'SHUFFLE', count: 4 },
    { key: 'CAT_HAIRY_POTATO', count: 4 },
    { key: 'CAT_TACOCAT', count: 4 },
    { key: 'CAT_RAINBOW_RALPHING', count: 4 },
    { key: 'CAT_BEARD', count: 4 },
    { key: 'CAT_CATTERMELON', count: 4 },
  ];

  for (const item of distribution) {
    for (let i = 0; i < item.count; i++) {
      nonDangerPool.push(createCardInstance(item.key));
    }
  }

  const shuffledPool = shuffleArray(nonDangerPool);

  // 6 total defuse cards: 4 dealt to players, 2 remain in draw deck
  const defuseKeys: Array<keyof typeof CARD_DEFINITIONS> = [
    'DEFUSE_LASER',
    'DEFUSE_BANJO',
    'DEFUSE_CATNIP',
    'DEFUSE_LASER',
    'DEFUSE_BANJO',
    'DEFUSE_CATNIP',
  ];
  const defuseCards = defuseKeys.map(k => createCardInstance(k));

  const playerHands: Card[][] = [[], [], [], []];

  // Deal 1 Defuse to each of the 4 players
  for (let p = 0; p < 4; p++) {
    playerHands[p].push(defuseCards[p]);
  }

  // Deal 4 random standard cards to each of the 4 players
  let poolIdx = 0;
  for (let round = 0; round < 4; round++) {
    for (let p = 0; p < 4; p++) {
      playerHands[p].push(shuffledPool[poolIdx++]);
    }
  }

  // Draw pile gets leftover cards from shuffled pool + leftover Defuses + 3 Exploding Kittens
  const leftoverStandard = shuffledPool.slice(poolIdx);
  const leftoverDefuses = defuseCards.slice(4); // 2 defuse cards
  const explodingKittens = [
    createCardInstance('EXPLODING_KITTEN'),
    createCardInstance('EXPLODING_KITTEN'),
    createCardInstance('EXPLODING_KITTEN'),
  ];

  const drawPile = shuffleArray([
    ...leftoverStandard,
    ...leftoverDefuses,
    ...explodingKittens,
  ]);

  return {
    playerHands,
    drawPile,
  };
}
