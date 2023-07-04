import { useContext, useEffect, useState } from "react";
import { OyaResult, OyaRound } from "../../game/gameTypes";
import { chooseOyaCardDelay } from "../game/variables";
import { GameContext } from "../GameContext";

const useGameChooseOya = (parentSetter: (roundData: OyaRound | {}) => void) => {
  const game = useContext(GameContext);
  const [oyaResult, setOyaResult] = useState([] as OyaResult);

  useEffect(() => {
    if (oyaResult.length == 0) return;

    (async () => {
      for (const roundData of [...oyaResult, {}]) {
        parentSetter(roundData);
        await new Promise((resolve) => {
          setTimeout(() => resolve(1), chooseOyaCardDelay);
        });
      }
    })();
  }, [oyaResult, parentSetter]);

  return () => {
    if (game.phase != "chooseOya") return;
    setOyaResult(game.chooseOya());
  };
};

export default useGameChooseOya;
