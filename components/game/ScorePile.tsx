import { CardSet, PlayerNames } from "../../game/gameTypes";
import { useAppSelector } from "../../redux/hooks";
import styles from "../../styles/game/ScorePile.module.scss";
import Card from "./Card";
import { MouseEventHandler, useContext, useMemo, useReducer } from "react";
import { createPortal } from "react-dom";
import { GameContext } from "../GameContext";
import fromCamelCase from "../helpers/fromCamelCase";

const Modal = ({
  playerName,
  closeModal,
}: {
  playerName: PlayerNames;
  closeModal: Function;
}) => {
  const game = useContext(GameContext);
  const cardList = useAppSelector(
    (state) => state.game.scorePiles[playerName].cardList
  );
  const yakuList = useMemo(
    () => game.getYakuWithCards(playerName),
    [game, playerName]
  );

  return (
    <div
      className={styles.modalContainer}
      onClick={closeModal as MouseEventHandler<HTMLDivElement>}
    >
      <div></div>
      <ul className={styles.wrapper}>
        {yakuList.yaku.map(
          ([yakuName, yakuPoints, cards]: [string, number, CardSet], i) => (
            <li key={i} className={styles.row}>
              <h5>{fromCamelCase(yakuName)}</h5>
              <strong>{yakuPoints}</strong>
              <ul className={styles.cardList}>
                {cards.map((cardData, n) => (
                  <li key={n}>
                    <Card cardData={cardData} />
                  </li>
                ))}
              </ul>
            </li>
          )
        )}
        <li className={styles.row}>
          <h5>Total Cards</h5>
          <ul className={styles.cardList}>
            {cardList.length == 0 ? <Card invisible={true} /> : null}
            {cardList.map((cardData, n) => (
              <li key={n}>
                <Card cardData={cardData} />
              </li>
            ))}
          </ul>
        </li>
      </ul>
      <div></div>
    </div>
  );
};

const ScorePile = ({ player }: { player: PlayerNames }) => {
  const [displayModal, toggleModal] = useReducer((state) => !state, false);
  const score = useAppSelector((state) => state.game.scorePiles[player].score);

  return (
    <>
      <div className={styles.counterContainer}>
        <span className={styles.scoreCounter} onClick={toggleModal}>
          {score}
        </span>
        <Card
          showBackSide={true}
          cardData={{ month: 1, name: "hikari" }}
          className={styles.cardButton}
          onClick={toggleModal}
        />
        <Card
          showBackSide={true}
          cardData={{ month: 1, name: "hikari" }}
          className={styles.cardButton}
          onClick={toggleModal}
        />
      </div>
      {displayModal
        ? createPortal(
            <Modal playerName={player} closeModal={toggleModal} />,
            document.querySelector("#modalContainer") as Element
          )
        : null}
    </>
  );
};

export default ScorePile;
