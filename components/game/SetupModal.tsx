import { useState, useContext, useEffect } from "react";
import styles from "../../styles/game/SetupModal.module.scss";
import { GameContext } from "../GameContext";
import { replaceHands, setCount, setRole } from "../../redux/gameReducer";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setupCardDelay } from "./variables";
import useSetTurnState from "../hooks/useSetTurnState";

const SetupModal = () => {
  const game = useContext(GameContext);
  const dispatch = useAppDispatch();
  const phase = useAppSelector((state) => state.game.turnPhase);
  const setTurnState = useSetTurnState();

  useEffect(() => {
    if (phase != "Setup") return;
    const data = game.setup();
    dispatch(replaceHands({ playerOne: [], playerTwo: [], playingField: [] }));
    dispatch(setRole({ playerName: game.oya, role: "oya" }));
    dispatch(setRole({ playerName: game.ko, role: "ko" }));

    if (data.length == 0) return;

    (async () => {
      let playerOneCount = 0;

      for (const {
        playerOne,
        playerTwo,
        playingField,
        deckCount,
        ...rest
      } of data) {
        dispatch(setCount({ valueName: "deckCount", count: deckCount }));

        if (playerOneCount > playerOne.length) {
          setShowLuckyHandModal(true);
          playerOneCount = 0;
        } else {
          setShowLuckyHandModal(false);
          playerOneCount = playerOne.length;
        }

        dispatch(replaceHands({ playerOne, playerTwo, playingField }));

        await new Promise((resolve) =>
          setTimeout(() => resolve(1), setupCardDelay)
        );
      }

      setTurnState();
    })();
  }, [phase, dispatch, game, setTurnState]);

  const [showLuckyHandModal, setShowLuckyHandModal] = useState(false);

  if (showLuckyHandModal) {
    return <div className={`modal ${styles.luckyHand}`}>Lucky Hand!</div>;
  }

  return null;
};

export default SetupModal;
