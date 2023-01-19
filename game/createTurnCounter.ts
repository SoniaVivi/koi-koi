import { PlayerAliases, PlayerNames, PlayerRole } from "./game";

type TurnCounter = {
  currentPhase: string;
  currentPlayer: PlayerRole;
  permittedToEndRound: boolean;
  phases: readonly string[] | "ended";
  currentRound: number;
  turn: number;
  nextPhase: (prevPhase: string) => void;
  forcePlayerTurn: (
    playerName: PlayerAliases,
    phase: "hand play" | "draw play" | "yaku check" | "round call"
  ) => void;
  nextTurn: () => void;
  permitToEndRound: (newValue: boolean) => void;
  endRound: (isTie?: boolean) => boolean;
  endGame: () => void;
};

const createTurnCounter = (
  getRoleFromName: (name: PlayerAliases) => PlayerRole
): TurnCounter => {
  const turnCounter = {
    currentPhase: "chooseOya",
    currentPlayer: "oya" as PlayerRole,
    permittedToEndRound: false,
    phases: [
      "chooseOya",
      "setup",
      "oya hand play",
      "oya draw play",
      "oya round call",
      "ko hand play",
      "ko draw play",
      "ko round call",
    ],
    currentRound: 1,
    turn: 0,
    nextPhase: (prevPhase: string) => {
      if (prevPhase == turnCounter.currentPhase) {
        turnCounter.currentPhase =
          turnCounter.phases[
            turnCounter.phases.indexOf(turnCounter.currentPhase) + 1
          ];
      }
    },
    forcePlayerTurn: (
      playerName: PlayerAliases,
      phase: "hand play" | "draw play" | "yaku check" | "round call"
    ): void => {
      turnCounter.currentPhase = `${getRoleFromName(playerName)} ${phase}`;
      turnCounter.currentPlayer = getRoleFromName(playerName);
    },
    nextTurn: () => {
      if (turnCounter.currentPhase.match(/round call/)) {
        turnCounter.forcePlayerTurn(
          turnCounter.currentPlayer == "oya" ? "ko" : "oya",
          "hand play"
        );
        turnCounter.permittedToEndRound = false;
      }
    },
    permitToEndRound: (newValue: boolean) =>
      (turnCounter.permittedToEndRound = newValue),
    endRound: (isTie = false) => {
      if (isTie) {
        turnCounter.currentRound += 1;
        turnCounter.currentPhase = "setup";
      } else if (turnCounter.currentPhase.match(/round call/)) {
        turnCounter.currentPhase = "setup";
        turnCounter.currentPlayer = "oya";
        turnCounter.currentRound += 1;
        return true;
      }
      return false;
    },
    endGame: () => {
      turnCounter.currentRound = -1;
      turnCounter.currentPhase = "ended";
    },
  };

  const setPlayer = (playerName: PlayerNames) =>
    (turnCounter.currentPlayer = getRoleFromName(playerName));

  return turnCounter;
};

export default createTurnCounter;
