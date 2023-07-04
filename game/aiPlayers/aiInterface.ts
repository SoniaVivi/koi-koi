import gameFactory from "../game";
import { AIPlayer, AIInterfaceActions, PlayerNames, Card } from "../gameTypes";

const aiInterface = (
  game: ReturnType<typeof gameFactory>,
  aiPlayer: AIPlayer,
  playerName: PlayerNames,
  callbacks: {
    [key in AIInterfaceActions]: (card?: Card | undefined) => void;
  } = {
    play: () => {},
    match: () => {},
    draw: () => {},
    koiKoi: () => {},
    endRound: () => {},
  }
): { turnInProgress: boolean } => {
  if (game.currentPlayer == playerName && game.cardToPlay) {
    // Can play cardToPlay (card that is drawn after calling game.draw())
    // Blindly because it always has to be played and it will be matched later
    // On by the AI.
    game.play(game.cardToPlay);
    callbacks.play();
    return { turnInProgress: true };
  }

  const aiAction: ReturnType<AIPlayer> = aiPlayer({
    name: playerName,
    cardHand: game.getHand(game.players[playerName]),
    playingField: game.getHand("playingField"),
    cardToPlay: game.cardToPlay,
    cardToMatch: game.cardToMatch,
    matchedCards: game.getScorePile(playerName),
    phase: game.phase,
    currentPlayer: game.currentPlayer,
  });

  if ("drawCard" in aiAction) {
    game.draw();
    callbacks.draw();
    return { turnInProgress: true };
  }
  if ("playCard" in aiAction) {
    game.play(aiAction.playCard);
    callbacks.play(aiAction.playCard);

    if (aiAction.matchCard !== null) {
      game.play(aiAction.matchCard);
      callbacks.match();
    }
    return { turnInProgress: true };
  }

  if ("roundAction" in aiAction) {
    if (aiAction.roundAction == "koiKoi" && game.endRoundOptions.koiKoi) {
      game.koiKoi();
      game.nextTurn();
      callbacks.koiKoi();
      return { turnInProgress: false };
    } else {
      game.shoubu();
      game.nextTurn();
      callbacks.endRound();
      return { turnInProgress: false };
    }
  }

  return { turnInProgress: false };
};

export default aiInterface;
