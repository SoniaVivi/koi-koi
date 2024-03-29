// ============================================
// cardHands related types
// ============================================

export type CardHands = PlayerCardSets & {
  playingField: CardSet;
  replace: (name: CardHandsAndPlayerRoles, newHand: CardSet) => CardSet;
  remove: (
    name: CardHandsAndPlayerRoles,
    cards: Card | CardSet
  ) => Card | CardSet;
  add: (player: CardHandsAndPlayerRoles, card: Card) => CardSet;
  exists: (name: CardHandsAndPlayerRoles, card: Card) => boolean;
  get: (name: CardHandsAndPlayerRoles) => CardSet;
  duplicate: (name: CardHandsAndPlayerRoles) => CardSet;
  getFieldMatches: (card: Card | null) => CardSet;
  reset: () => void;
  get doPlayersHaveCards(): boolean;
};

export type Score = { score: number; yaku: Array<[string, number]> };

export type ScorePiles = PlayerCardSets & {
  scores: {
    playerOne: {
      total: number;
      scored: CardSet;
      yaku: Array<[string, number]>;
      modifier: number;
      tempScore: number;
    };
    playerTwo: {
      total: number;
      scored: CardSet;
      yaku: Array<[string, number]>;
      modifier: number;
      tempScore: number;
    };
  };
  get: (name: PlayerAliases) => CardSet;
  replace: (name: PlayerAliases, replacementHand: CardSet) => CardSet;
  getTotal: (target: PlayerAliases) => Score;
  add: (name: PlayerAliases, cards: Card | Array<Card>) => CardSet;
  scorePoints: (name: PlayerAliases) => void;
  addScoreModifier: (player: PlayerAliases, modifier: number) => void;
  resetScoreModifiers: () => void;
  calculateTempScore: () => { score: number; isImproved: boolean };
  resetTempScore: () => void;
  chooseWinner: () => PlayerNames | "tie";
  getYakuWithCards: (target: PlayerAliases) => {
    score: number;
    yaku: Array<[string, number, CardSet]>;
  };
  get playerScores(): { playerOne: number; playerTwo: number };
};

// ============================================
// Deck related types
// ============================================

export interface Card {
  name: "hikari" | "tanzaku" | "tane" | "kasu";
  month: number;
}

export type CardSet = Array<Card>;

export type MonthFormat = {
  [index: string]: number | undefined;
  kasu: number;
  hikari?: number;
  tane?: number;
  tanzaku?: number;
};

// ============================================
// Game related types
// ============================================

export type OyaRound = {
  playerOne: { card: Card; oya: boolean };
  playerTwo: { card: Card; oya: boolean };
};

export type OyaResult = Array<OyaRound>;

export type PlayerNames = "playerOne" | "playerTwo";

export type SetupRound = {
  deckCount: number;
  playerOne: CardSet;
  playerTwo: CardSet;
  playingField: CardSet;
  suppliedEntity: PlayerNames | "playingField";
};

export type PlayerRole = "oya" | "ko";

export type CardHandsAndPlayerRoles =
  | PlayerNames
  | PlayerRole
  | "playingField"
  | "current"
  | "opponent";

export type PlayerCardSets = {
  playerOne: CardSet;
  playerTwo: CardSet;
};

export type PlayerAliases = PlayerNames | PlayerRole | "current";

export type GameLengths = "year" | "halfYear" | "season";

// ============================================
// AI related types
// ============================================

export type AIPlayerCodeNames =
  | "miorine"
  | "dummyPlug"
  | "kamina"
  | "tachikoma"
  | "suletta";

export type AIPlayer = ({
  name,
  cardHand,
  playingField,
  matchedCards,
  currentPlayer,
  phase,
  cardToPlay = null,
  cardToMatch = null,
}: {
  name: PlayerNames;
  cardHand: CardSet;
  playingField: CardSet;
  matchedCards: CardSet;
  currentPlayer: PlayerNames;
  phase: string;
  cardToPlay: Card | null;
  cardToMatch: Card | null;
}) =>
  | { roundAction: "koiKoi" | "shoubuOrNextTurn" }
  | { playCard: Card; matchCard: null | Card }
  | { drawCard: boolean }
  | {};

export type AIInterfaceActions =
  | "play"
  | "match"
  | "draw"
  | "koiKoi"
  | "endRound";
