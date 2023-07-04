import styles from "../styles/Home.module.scss";
import GameHeader from "../components/game/GameHeader";
import PlayerHand from "../components/game/PlayerHand";
import { GameContext } from "../components/GameContext";
import game from "../game/game";
import { useEffect, useState } from "react";
import ChooseOyaModal from "../components/game/ChooseOyaModal";
import SetupModal from "../components/game/SetupModal";
import Deck from "../components/game/Deck";
import ScorePile from "../components/game/ScorePile";
import useAIPlayer from "../components/hooks/useAIPlayer";
import Card from "../components/game/Card";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { createPortal } from "react-dom";
import { setLastRoundCall } from "../redux/gameReducer";
import fromCamelCase from "../components/helpers/fromCamelCase";

const PlayerWrapper = () => {
  useAIPlayer({
    playerName: "playerTwo",
    skip: false,
  });

  return (
    <div>
      <PlayerHand playerName="playerTwo" hideCards={true}></PlayerHand>
      <PlayerHand playerName="playingField" hideCards={false} />
      <PlayerHand playerName="playerOne" hideCards={false}></PlayerHand>
    </div>
  );
};

const ActiveCardDisplay = () => {
  const activeCard = useAppSelector((state) => {
    if (state.game.cardHands.cardToMatch !== null) {
      return state.game.cardHands.cardToMatch;
    } else if (state.game.cardHands.cardToPlay !== null) {
      return state.game.cardHands.cardToPlay;
    } else if (state.game.cardHands.lastPlayedCard) {
      return state.game.cardHands.lastPlayedCard;
    }
    return null;
  });

  return (
    <Card
      cardData={activeCard ?? { name: "kasu", month: 1 }}
      showBackSide={activeCard === null}
    />
  );
};

const EndRoundPopup = () => {
  const lastRoundCall = useAppSelector((state) => state.game.lastRoundCall);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (lastRoundCall === "") return;
    setTimeout(() => dispatch(setLastRoundCall("")), 500);
  }, [lastRoundCall, dispatch]);

  if (["endRound", ""].includes(lastRoundCall)) {
    return null;
  }

  return createPortal(
    <div className="modal">
      <div className="popup">{fromCamelCase(lastRoundCall)}</div>
    </div>,
    document.querySelector("#modalContainer") as Element
  );
};

export default function Home() {
  const [gameObj, _] = useState(game());

  return (
    <GameContext.Provider value={gameObj}>
      <div></div>
      <div className={styles.container}>
        <GameHeader />
        <div className={styles.wrapper}>
          <div className={styles.sidebar}>
            <ActiveCardDisplay />
          </div>
          <PlayerWrapper />
          <div className={styles.sidebar}>
            <ScorePile player="playerTwo" />
            <Deck />
            <ScorePile player="playerOne" />
          </div>
        </div>
        <ChooseOyaModal />
        <SetupModal />
      </div>
      <div></div>
      <EndRoundPopup />
    </GameContext.Provider>
  );
}
