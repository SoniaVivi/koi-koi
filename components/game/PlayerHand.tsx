import { PlayerNames } from "../../game/game";
import styles from "../../styles/game/PlayerHand.module.scss";
import Card from "./Card";
import ScorePile from "./playerHand/ScorePile";

const PlayerHand = ({
  playerName,
  orientation = "cardsAtBottom",
  hideCards = false,
}: {
  playerName: PlayerNames;
  orientation?: "cardsAtBottom" | "cardsAtTop";
  hideCards?: boolean;
}) => {
  return (
    <div className={`${styles.container} ${styles[orientation]}`}>
      <div
        className={`flex justify-center wrap ${styles.cardWrapper} ${
          hideCards ? styles.hideCards : ""
        }`}
      >
        {[...Array(8)].map((_, i) => (
          <Card
            key={i}
            cardData={{ month: 1, name: "hikari" }}
            showBackSide={hideCards}
          />
        ))}
      </div>
      <ScorePile />
    </div>
  );
};

export default PlayerHand;
