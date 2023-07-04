import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  AIPlayerCodeNames,
  Card,
  CardSet,
  GameLengths,
  PlayerNames,
  PlayerRole,
} from "../game/gameTypes";
import { duplicateCardSet } from "../game/deck";
import { defaultDeckSize } from "../components/game/variables";
import { YakuScore } from "../game/yakuMatcher";

type ReduxScorePile = {
  playerOne: {
    score: number;
    yaku: [];
    cardList: CardSet;
    scoreModifiers: number;
  };
  playerTwo: {
    score: number;
    yaku: [];
    cardList: CardSet;
    scoreModifiers: number;
  };
};

const initialState = {
  oya: "",
  ko: "",
  currentPlayer: "",
  turn: 0,
  deckCount: defaultDeckSize,
  turnPhase: "Game Start",
  scores: { playerOne: 0, playerTwo: 0 },
  cardHands: {
    playerOne: [] as CardSet,
    playerTwo: [] as CardSet,
    playingField: [] as CardSet,
    cardToMatch: null as null | Card,
    cardToPlay: null as null | Card,
    lastPlayedCard: null as null | Card,
  },
  scorePiles: {
    playerOne: {
      score: 0 as number,
      cardList: [] as CardSet,
      scoreModifiers: 1.0,
    },
    playerTwo: {
      score: 0 as number,
      cardList: [] as CardSet,
      scoreModifiers: 1.0,
    },
  } as ReduxScorePile,
  AICodename: "miorine" as AIPlayerCodeNames,
  aiPlayers: {} as { [key in PlayerNames]: true },
  endRoundOptions: { koiKoi: false, shoubu: false, endRound: false },
  lastRoundCall: "",
  roundLimit: "year" as GameLengths,
};

export const gameSlice = createSlice({
  name: "game",
  initialState: initialState,
  reducers: {
    setRole: (
      state,
      {
        payload: { playerName, role },
      }: { payload: { playerName: PlayerNames; role: PlayerRole } }
    ) => {
      state[role] = playerName;
    },
    setTurnMetadata: (
      state,
      {
        payload: { phase, currentPlayer },
      }: PayloadAction<{
        phase: string;
        currentPlayer: PlayerNames;
      }>
    ) => {
      if (typeof phase !== "undefined") {
        state.turnPhase = phase;
      }

      if (typeof currentPlayer !== "undefined") {
        state.currentPlayer = currentPlayer;
      }
    },
    replaceHands: (
      state,
      {
        payload: playerHands,
      }: {
        payload: {
          playerOne?: CardSet;
          playerTwo?: CardSet;
          playingField?: CardSet;
        };
      }
    ) => {
      Object.entries(playerHands).forEach(([playerName, playerHand]) => {
        state.cardHands[
          playerName as "playerOne" | "playerTwo" | "playingField"
        ] = duplicateCardSet(playerHand);
      });
    },
    setCount: (
      state,
      {
        payload: { valueName, count },
      }: { payload: { valueName: "turn" | "deckCount"; count: number } }
    ) => {
      state[valueName] = count;
    },
    setCardsInPlay: (
      state,
      {
        payload: data,
      }: {
        payload: {
          cardToMatch?: Card | null;
          cardToPlay?: Card | null;
          lastPlayedCard?: Card | null;
        };
      }
    ) => {
      Object.entries(data).forEach(
        ([cardName, card]) =>
          (state.cardHands[
            cardName as "cardToMatch" | "cardToPlay" | "lastPlayedCard"
          ] = card)
      );
    },
    updateScorePiles: (
      state,
      {
        payload: scorePiles,
      }: PayloadAction<{
        playerOne?: {
          score?: number;
          yaku?: YakuScore;
          cardList?: CardSet;
          scoreModifiers?: number;
        };
        playerTwo?: {
          score?: number;
          yaku?: YakuScore;
          cardList?: CardSet;
          scoreModifiers?: number;
        };
      }>
    ) =>
      Object.entries(scorePiles).forEach(([playerName, data]) => {
        Object.entries(data).forEach(([keyName, value]) => {
          // @ts-ignore
          state.scorePiles[playerName][keyName] = value;
        });
      }),
    addAIPlayer: (
      state,
      { payload: { name } }: PayloadAction<{ name: PlayerNames }>
    ) => {
      state.aiPlayers[name] = true;
    },
    updateEndRoundOptions: (
      state,
      {
        payload,
      }: PayloadAction<{
        koiKoi?: boolean;
        shoubu?: boolean;
        endRound?: boolean;
      }>
    ) => {
      Object.entries(payload).forEach(([name, value]) => {
        state.endRoundOptions[name as "koiKoi" | "shoubu" | "endRound"] = value;
      });
    },
    updatePlayerScores: (
      state,
      { payload }: PayloadAction<{ [key in PlayerNames]: number }>
    ) => {
      Object.entries(payload).forEach(
        ([playerName, newScore]) =>
          (state.scores[playerName as PlayerNames] = newScore)
      );
    },
    restart: () => initialState,
    setAIPlayer: (
      state,
      { payload: codeName }: PayloadAction<AIPlayerCodeNames>
    ) => {
      state.AICodename = codeName;
    },
    setLastRoundCall: (
      state,
      { payload }: PayloadAction<"shoubu" | "koiKoi" | "endRound" | "">
    ) => {
      state.lastRoundCall = payload;
    },
  },
});

export const {
  setRole,
  replaceHands,
  setCount,
  setTurnMetadata,
  setCardsInPlay,
  updateScorePiles,
  addAIPlayer,
  updateEndRoundOptions,
  updatePlayerScores,
  restart,
  setAIPlayer,
  setLastRoundCall,
} = gameSlice.actions;

export default gameSlice.reducer;
