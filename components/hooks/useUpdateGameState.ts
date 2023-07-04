import { useContext, useMemo } from "react";
import {
  AIInterfaceActions,
  Card,
  CardSet,
  PlayerNames,
} from "../../game/gameTypes";
import { useAppDispatch } from "../../redux/hooks";
import { GameContext } from "../GameContext";
import {
  replaceHands,
  setCardsInPlay,
  setCount,
  setLastRoundCall,
  setTurnMetadata,
  updateEndRoundOptions,
  updatePlayerScores,
  updateScorePiles,
} from "../../redux/gameReducer";
import fromCamelCase from "../helpers/fromCamelCase";

const useUpdateGameState = (
  playerName: PlayerNames | "playingField"
): { [key in AIInterfaceActions]: (card?: null | Card) => void } => {
  const game = useContext(GameContext);
  const dispatch = useAppDispatch();

  const gameActions = useMemo(() => {
    const updateScorePilesAndReplaceHands = () => {
      const name =
        playerName == "playingField" ? game.currentPlayer : playerName;
      const cardList = game.getScorePile(name) as CardSet;

      dispatch(
        replaceHands({
          [playerName]: game.getHand(playerName),
          playingField: game.getHand("playingField"),
        })
      );

      dispatch(
        updateScorePiles({
          [name]: {
            score: game.getPotentialScore(name).score as number,
            cardList,
          },
        })
      );
    };

    const updateTurn = () => {
      dispatch(
        setTurnMetadata({
          phase: fromCamelCase(game.phase),
          currentPlayer: game.currentPlayer,
        })
      );
      dispatch(setCount({ valueName: "turn", count: game.round }));

      dispatch(updateEndRoundOptions(game.endRoundOptions));
    };

    const match = () => {
      updateScorePilesAndReplaceHands();
      dispatch(setCardsInPlay({ cardToMatch: null }));
      updateTurn();
    };

    const play = (card: Card | null = null) => {
      updateScorePilesAndReplaceHands();
      dispatch(
        setCardsInPlay({
          cardToMatch: game.cardToMatch,
          cardToPlay: game.cardToPlay,
          lastPlayedCard: card,
        })
      );
      updateTurn();
    };

    const endRound = () => {
      const scoreModifiers = game.scoreModifiers;
      dispatch(updatePlayerScores(game.scores));
      dispatch(
        updateScorePiles({
          playerOne: {
            scoreModifiers: scoreModifiers.playerOne,
            score: game.getPotentialScore("playerOne").score,
            cardList: game.getScorePile("playerOne"),
          },
          playerTwo: {
            scoreModifiers: scoreModifiers.playerTwo,
            score: game.getPotentialScore("playerTwo").score,
            cardList: game.getScorePile("playerTwo"),
          },
        })
      );
      updateTurn();
    };

    if (playerName == "playingField")
      return {
        play,
        draw: () => {},
        koiKoi: () => {},
        match,
        endRound: () => {},
      };

    return {
      play,
      match,
      draw: () => {
        dispatch(setCardsInPlay({ cardToPlay: game.cardToPlay }));
        dispatch(setCount({ valueName: "deckCount", count: game.deckCount }));
        updateTurn();
      },
      koiKoi: () => {
        endRound();
        dispatch(setLastRoundCall("koiKoi"));
      },
      endRound,
    };
  }, [dispatch, game, playerName]);

  return gameActions;
};

export default useUpdateGameState;
