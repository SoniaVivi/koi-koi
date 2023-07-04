import { createSelector } from "reselect";
import { CardSet, PlayerNames } from "../../game/gameTypes";
import { useAppSelector } from "../../redux/hooks";
import styles from "../../styles/game/PlayerHand.module.scss";
import useUpdateGameState from "../hooks/useUpdateGameState";
import Card from "./Card";
import { ReactNode, useContext } from "react";
import { GameContext } from "../GameContext";

const selectGameData = createSelector(
  [
    (state, playerName) => state.game.cardHands[playerName],
    (state, playerName) =>
      state.game.currentPlayer == playerName ||
      (playerName == "playingField" && state.game.cardHands.cardToMatch),
    (state, playerName) => playerName in state.game.aiPlayers,
  ],
  (cardHand, currentlyPlaying, isAI) => ({
    cardHand,
    currentlyPlaying,
    isAI,
  })
);

const selectCardHandMetadata = createSelector(
  [
    (state) => state.game.cardHands.cardToMatch,
    (state) => state.game.cardHands.cardToPlay,
    (state) => state.game.turnPhase,
    (state) => state.game.currentPlayer in state.game.aiPlayers,
  ],
  (cardToMatch, cardToPlay, phase, isCurrentPlayerAI) => ({
    cardToMatch,
    cardToPlay,
    phase,
    isCurrentPlayerAI,
  })
);

const selectEndRoundData = createSelector(
  [(state) => state.game.currentPlayer, (state) => state.game.endRoundOptions],
  (current, options) => ({ currentPlayer: current, endRoundOptions: options })
);

const EndRoundOptionsWrapper = () => {
  const game = useContext(GameContext);
  const { currentPlayer, endRoundOptions } = useAppSelector(selectEndRoundData);
  const { koiKoi: uiKoiKoi, endRound: uiEndRound } =
    useUpdateGameState(currentPlayer);

  if (endRoundOptions.shoubu) {
    return (
      <div className={styles.overlay}>
        <div
          className={`${styles.endRoundOptionWrapper} ${styles.matchable}`}
          onClick={() => {
            if (game.shoubu() === true) {
              uiEndRound();
            }
          }}
        >
          <span>Shoubu</span>
          <Card showBackSide={true} cardData={{ month: 1, name: "kasu" }} />
        </div>
        <div
          className={`${styles.endRoundOptionWrapper} ${styles.matchable}`}
          onClick={() => {
            game.koiKoi();
            uiKoiKoi();
          }}
        >
          <span>Koi Koi</span>
          <Card showBackSide={true} cardData={{ month: 1, name: "kasu" }} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div
        className={`${styles.endRoundOptionWrapper} ${styles.matchable}`}
        onClick={() => {
          game.nextTurn();
          uiEndRound();
        }}
      >
        <span>End Turn</span>
        <Card showBackSide={true} cardData={{ month: 1, name: "kasu" }} />
      </div>
    </div>
  );
};

const InteractableHand = ({
  hideCards,
  playerName,
  cards,
  currentlyPlaying,
}: {
  hideCards: boolean;
  playerName: PlayerNames | "playingField";
  cards: CardSet;
  currentlyPlaying: boolean;
}) => {
  const game = useContext(GameContext);
  const { play: uiPlay, match: uiMatch } = useUpdateGameState(playerName);
  const { cardToMatch, cardToPlay, phase, isCurrentPlayerAI } = useAppSelector(
    selectCardHandMetadata
  );

  return (
    <div
      className={`${styles.cardWrapper} ${hideCards ? styles.hideCards : ""}`}
      onClick={(e) => {
        // @ts-ignore
        if (typeof e.target.dataset.identity != "string" || !currentlyPlaying)
          return;
        // @ts-ignore
        let cardData = e.target.dataset.identity.split("_");
        cardData = { name: cardData[0], month: Number(cardData[1]) };

        if (
          playerName !== "playingField" &&
          cardToMatch === null &&
          cardToPlay === null &&
          phase.includes("hand play")
        ) {
          game.play(cardData);
          uiPlay(cardData);
        } else if (
          playerName === "playingField" &&
          cardToMatch !== null &&
          cardToPlay == null
        ) {
          game.play(cardData);
          uiMatch();
        }
      }}
    >
      {cards.length == 0 ? (
        <>
          <Card invisible={true} />
          <Card invisible={true} />
          <Card invisible={true} />
        </>
      ) : null}
      {cards.map((cardData, i) => (
        <Card
          key={`${cardData.month}_${cardData.name}_${i}`}
          cardData={cardData}
          showBackSide={hideCards}
          showMatchIndicator={playerName == "playerOne"}
          className={`${
            playerName == "playingField" && cardData.month == cardToMatch?.month
              ? styles.matchable
              : undefined
          } ${playerName !== "playingField" ? "clickable" : null}`}
        />
      ))}
      {cardToPlay && playerName == "playingField" ? (
        <div className={styles.overlay}>
          <Card
            cardData={cardToPlay}
            className={`clickable ${styles.matchable}`}
            onClick={() => {
              if (isCurrentPlayerAI) return;

              game.play(cardToPlay);
              uiPlay();
            }}
          />
        </div>
      ) : null}
      {currentlyPlaying &&
      !isCurrentPlayerAI &&
      phase.includes("round call") ? (
        <EndRoundOptionsWrapper />
      ) : null}
    </div>
  );
};

const PlayerHand = ({
  playerName,
  hideCards = false,
}: {
  playerName: PlayerNames | "playingField";
  hideCards?: boolean;
}) => {
  const {
    cardHand,
    currentlyPlaying,
    isAI,
  }: { cardHand: CardSet; currentlyPlaying: boolean; isAI: boolean } =
    useAppSelector((state) => selectGameData(state, playerName));

  if (cardHand.length == 0 && !currentlyPlaying) {
    return (
      <div
        className={`${styles.container} ${styles.noChildren} ${
          playerName == "playingField" ? styles.playingField : ""
        }`}
      >
        <div
          className={`flex justify-center wrap ${styles.cardWrapper} ${
            hideCards ? styles.hideCards : ""
          }`}
        >
          <Card invisible={true} />
          <Card invisible={true} />
        </div>
      </div>
    );
  } else if (isAI && playerName != "playingField") {
    return (
      <div className={styles.container}>
        <div
          className={`${styles.cardWrapper} ${
            hideCards ? styles.hideCards : ""
          }`}
        >
          {cardHand.map((cardData, i) => (
            <Card
              key={`${cardData.month}_${cardData.name}_${i}`}
              cardData={cardData}
              showBackSide={hideCards}
              showMatchIndicator={playerName == "playerOne"}
            />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={`${styles.container} ${
          playerName == "playingField" ? styles.playingField : ""
        }`}
      >
        <InteractableHand
          hideCards={hideCards}
          playerName={playerName}
          cards={cardHand}
          currentlyPlaying={currentlyPlaying}
        />
      </div>
    );
  }
};

export default PlayerHand;
