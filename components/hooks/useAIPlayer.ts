import { createSelector } from "reselect";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useContext, useEffect, useRef } from "react";
import { PlayerNames, AIPlayer, AIPlayerCodeNames } from "../../game/gameTypes";
import aiInterface from "../../game/aiPlayers/aiInterface";
import { GameContext } from "../GameContext";
import useUpdateGameState from "./useUpdateGameState";
import { aiPlayerDelay } from "../game/variables";
import { addAIPlayer } from "../../redux/gameReducer";
import AIPlayers from "../../game/aiPlayers/aiPlayers";

const selectGameData = createSelector(
  [
    (state) => state.game.currentPlayer,
    (state) => state.game.AICodename,
    (state) => state.game.turnPhase,
    (state) => state.game.turnPhase == "Game Start",
  ],
  (currentPlayer, codeName, phase, isStartOfGame) => ({
    currentPlayer,
    codeName,
    phase,
    isStartOfGame,
  })
);

const useAIPlayer = ({
  playerName,
  skip = true,
}: {
  playerName: PlayerNames;
  skip: boolean;
}) => {
  const game = useContext(GameContext);
  const dispatch = useAppDispatch();
  const {
    currentPlayer,
    codeName,
    phase,
    isStartOfGame,
  }: {
    currentPlayer: PlayerNames;
    codeName: AIPlayerCodeNames;
    isStartOfGame: boolean;
    phase: string;
  } = useAppSelector(selectGameData);
  const gameCallbacks = useUpdateGameState(playerName);
  const isPlaying = useRef(false);

  useEffect(() => {
    dispatch(addAIPlayer({ name: playerName }));
  }, [playerName, isStartOfGame, dispatch]);

  useEffect(
    () => {
      if (
        currentPlayer != playerName ||
        skip ||
        phase.includes("hand play") !== true ||
        isPlaying.current == true
      )
        return;

      (async () => {
        let continueTurn: boolean = true;
        while (continueTurn) {
          await new Promise((resolve) => {
            setTimeout(() => {
              continueTurn = aiInterface(
                game,
                AIPlayers[codeName],
                playerName,
                gameCallbacks
              ).turnInProgress;
              resolve(1);
            }, aiPlayerDelay);
          });
        }
        isPlaying.current = false;
      })();
    },
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPlayer, phase, codeName]
  );
};

export default useAIPlayer;
