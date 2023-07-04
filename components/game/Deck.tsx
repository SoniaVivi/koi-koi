import { useAppSelector } from "../../redux/hooks";
import Card from "./Card";
import { defaultCardSize } from "./variables";
import styles from "../../styles/game/Deck.module.scss";
import { useContext } from "react";
import { GameContext } from "../GameContext";
import useUpdateGameState from "../hooks/useUpdateGameState";

const Deck = () => {
  const game = useContext(GameContext);
  const canDraw = useAppSelector(
    (state) =>
      !(state.game.currentPlayer in state.game.aiPlayers) &&
      state.game.turnPhase.includes("draw") &&
      !state.game.cardHands.cardToPlay &&
      !state.game.cardHands.cardToMatch
  );
  const { draw: drawCallback } = useUpdateGameState(game.currentPlayer);
  const deckCount = useAppSelector((state) => state.game.deckCount);

  return (
    <div
      className={`${styles.container} clickable ${
        canDraw ? styles.canDraw : ""
      }`}
      onClick={() => {
        if (!canDraw) return;
        game.draw();
        drawCallback();
      }}
    >
      <Card
        showBackSide={true}
        cardData={{ month: 1, name: "kasu" }}
        width={defaultCardSize.width}
        height={defaultCardSize.height}
        className={styles.card}
      />
      <div className={styles.counter}>
        <span>{deckCount}</span>
      </div>
    </div>
  );
};

export default Deck;
