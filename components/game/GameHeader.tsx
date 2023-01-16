import styles from "../../styles/game/GameHeader.module.scss";

const GameHeader = () => {
  return (
    <div className={styles.container}>
      <div>
        <span className={styles.score}>33</span>
        <div className={styles.turnDisplay}>
          <span>Choose Oya</span>
          <span>Round 11</span>
        </div>
        <span className={styles.score}>34</span>
      </div>
      <button className={`main-button clickable ${styles.menu}`}>
        <div></div>
        <div></div>
        <div></div>
      </button>
    </div>
  );
};

export default GameHeader;
