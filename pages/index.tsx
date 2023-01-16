import styles from "../styles/Home.module.scss";
import GameHeader from "../components/game/GameHeader";
import PlayerHand from "../components/game/PlayerHand";
import Card from "../components/game/Card";
import PlayingField from "../components/game/PlayingField";

export default function Home() {
  return (
    <div className={styles.container}>
      <GameHeader />
      <PlayerHand
        playerName="playerTwo"
        orientation="cardsAtTop"
        hideCards={true}
      ></PlayerHand>
      <PlayingField />
      <PlayerHand
        playerName="playerOne"
        orientation="cardsAtBottom"
      ></PlayerHand>
    </div>
  );
}
