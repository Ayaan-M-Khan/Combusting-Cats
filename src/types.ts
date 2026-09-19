export type CardType = 
  | 'EXPLODING_KITTEN'
  | 'DEFUSE'
  | 'ATTACK'
  | 'SKIP'
  | 'SEE_THE_FUTURE'
  | 'ALTER_THE_FUTURE'
  | 'FAVOR'
  | 'SHUFFLE'
  | 'CAT_TACOCAT'
  | 'CAT_HAIRY_POTATO'
  | 'CAT_RAINBOW_RALPHING'
  | 'CAT_BEARD'
  | 'CAT_CATTERMELON';

export interface Card {
  id: string;
  type: CardType;
  title: string;
  subTitle: string;
  actionText: string;
  flavorText: string;
  category: 'danger' | 'defuse' | 'action' | 'cat';
  badgeColor: string; // e.g. '#22c55e', '#ef4444'
  bgTone: string;
  iconName: string;
}

export interface Player {
  id: string;
  name: string;
  isHuman: boolean;
  avatarId: string;
  avatarBg: string;
  hand: Card[];
  isDead: boolean;
  cardsCount: number;
  lastAction?: string;
  dialogue?: string;
}

export type ModalType = 
  | null
  | 'DEFUSE_PROMPT'
  | 'SEE_FUTURE'
  | 'ALTER_FUTURE'
  | 'FAVOR_TARGET'
  | 'CAT_PAIR_TARGET'
  | 'TUTORIAL'
  | 'MENU'
  | 'GAME_OVER';

export interface ActionLogItem {
  id: string;
  playerId: string;
  playerName: string;
  playerAvatar: string;
  cardTitle?: string;
  cardType?: CardType;
  message: string;
  time: string;
}

export interface MatchStats {
  turnsPlayed: number;
  kittensDefused: number;
  attacksPlayed: number;
  cardsStolen: number;
  winnerName: string;
  isHumanWinner: boolean;
}
