import { useCallback, useContext } from "react";
import { setRole, setTurnMetadata } from "../../redux/gameReducer";
import { useAppDispatch } from "../../redux/hooks";
import { GameContext } from "../GameContext";
import fromCamelCase from "../helpers/fromCamelCase";

const useSetTurnState = (): (() => void) => {
  const game = useContext(GameContext);
  const dispatch = useAppDispatch();
  const setTurnState = useCallback(() => {
    dispatch(setRole({ playerName: game.oya, role: "oya" }));
    dispatch(setRole({ playerName: game.ko, role: "ko" }));
    dispatch(
      setTurnMetadata({
        phase: fromCamelCase(game.phase),
        currentPlayer: game.currentPlayer,
      })
    );
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return setTurnState;
};

export default useSetTurnState;
