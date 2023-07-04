import styles from "../../styles/game/GameHeader.module.scss";
import { useAppSelector } from "../../redux/hooks";
import { createSelector } from "reselect";
import { RootState } from "../../redux/store";
import { PlayerRole } from "../../game/gameTypes";
import { useReducer } from "react";
import { createPortal } from "react-dom";
import Menu from "./Menu";

const selectData = createSelector(
  [(state: RootState) => state.game, (state) => state.game.AICodename],
  (data, aiCodeName) => ({
    turn: data.turn,
    scores: data.scores,
    phase: data.turnPhase,
    oya: data.oya,
    ko: data.ko,
    aiCodeName,
    roundLimit: data.roundLimit,
  })
);

const PlayerDisplay = ({
  playerName,
  playerRole,
  score,
}: {
  playerName: string;
  score: number;
  playerRole: PlayerRole | null;
}) => {
  return (
    <div className={styles.playerWrapper}>
      <span className={styles.score}>{score}</span>
      <div className={styles.playerData}>
        <span>{playerName}</span>
        {playerRole ? (
          <span>
            {playerRole.slice(0, 1).toUpperCase() + playerRole.slice(1)}
          </span>
        ) : (
          "Unassigned"
        )}
      </div>
    </div>
  );
};

const GameHeader = () => {
  const { turn, scores, phase, oya, ko, aiCodeName, roundLimit } =
    useAppSelector(selectData);
  const [showMenu, toggleMenu] = useReducer((state) => !state, false);
  const playerAndRoles: {
    playerOne: PlayerRole | null;
    playerTwo: PlayerRole | null;
  } = {
    playerOne: "playerOne" == oya ? "oya" : "playerOne" == ko ? "ko" : null,
    playerTwo: "playerTwo" == oya ? "oya" : "playerTwo" == ko ? "ko" : null,
  };

  return (
    <>
      <div className={styles.container}>
        <div>
          <PlayerDisplay
            playerName={"You"}
            score={scores.playerOne}
            playerRole={playerAndRoles["playerOne"]}
          />
          <div className={styles.turnDisplay}>
            <span>
              {phase
                .split(" ")
                .map(
                  (word) =>
                    word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ")}
            </span>
            <span>
              Round {turn} of {{ year: 12, halfYear: 6, season: 3 }[roundLimit]}
            </span>
          </div>
          <PlayerDisplay
            playerName={
              aiCodeName.slice(0, 1).toUpperCase() + aiCodeName.slice(1)
            }
            score={scores.playerTwo}
            playerRole={playerAndRoles["playerTwo"]}
          />
        </div>
        <button
          className={`main-button clickable ${styles.menu}`}
          onClick={toggleMenu}
        >
          <div></div>
          <div></div>
          <div></div>
        </button>
      </div>
      {showMenu
        ? createPortal(
            <Menu onClose={toggleMenu} />,
            document.querySelector("#modalContainer") as Element
          )
        : null}
    </>
  );
};

export default GameHeader;
