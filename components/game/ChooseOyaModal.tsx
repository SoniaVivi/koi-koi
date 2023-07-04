import { useCallback, useState } from "react";
import { OyaRound, PlayerNames } from "../../game/gameTypes";
import { useAppSelector } from "../../redux/hooks";
import styles from "../../styles/game/ChooseOyaModal.module.scss";
import useGameChooseOya from "../hooks/useGameChooseOya";
import Card from "./Card";
import useSetTurnState from "../hooks/useSetTurnState";

const ChooseOyaModal = () => {
  const setTurnState = useSetTurnState();
  const isGameStart = useAppSelector(
    (state) => state.game.turnPhase == "Game Start"
  );
  const [drawnCards, setDrawnCards] = useState({} as OyaRound | {});
  const displayOyaSelectionCards = useCallback(
    (result: OyaRound | {}): void => {
      setDrawnCards(result);
      if (!Object.hasOwn(result, "playerOne")) {
        setTurnState();
      }
    },
    [setTurnState]
  );
  const chooseOya = useGameChooseOya(displayOyaSelectionCards);

  const getWinStatusText = (
    playerName: PlayerNames,
    roundState: OyaRound
  ): string => {
    if (
      roundState[playerName].oya !=
      roundState[playerName == "playerOne" ? "playerTwo" : "playerOne"].oya
    ) {
      return roundState[playerName].oya ? "Winner - Oya" : "Loser - Ko";
    }

    return "Tie";
  };

  if (!isGameStart) {
    return null;
  } else if (!Object.hasOwn(drawnCards, "playerOne")) {
    return (
      <div className={styles.modal}>
        <div className={styles.buttonWrapper} onClick={chooseOya}>
          <button className={styles.triangle}></button>
          <div className={styles.cutter}></div>
          <div className={styles.cutter}></div>
        </div>
        <span className={`main-button ${styles.startButton}`}>Start Game</span>
      </div>
    );
  } else {
    return (
      <div className={`modal ${styles.horizontal}`}>
        <div className={styles.cardWrapper}>
          <Card
            cardData={(drawnCards as OyaRound).playerOne.card}
            width={126}
            height={206}
          ></Card>
          <span>Player One</span>
          <span>{getWinStatusText("playerOne", drawnCards as OyaRound)}</span>
        </div>
        <div className={styles.cardWrapper}>
          <Card
            cardData={(drawnCards as OyaRound).playerTwo.card}
            width={126}
            height={206}
          ></Card>
          <span>Player Two</span>
          <span>{getWinStatusText("playerTwo", drawnCards as OyaRound)}</span>
        </div>
      </div>
    );
  }
};

export default ChooseOyaModal;
