import styles from "../../../styles/game/ScorePile.module.scss";
import Card from "../Card";

const ScorePile = () => {
  return (
    <div className={styles.container}>
      <span className={styles.scoreCounter}>12</span>
      <ul className={styles.yakuList}>
        <li className={styles.yaku}>
          <span>
            <strong>7</strong> Rainy Four Hikari
          </span>
          <div>
            <Card
              cardData={{ month: 1, name: "hikari" }}
              width={25.2}
              height={41.2}
            />
            <Card
              cardData={{ month: 3, name: "hikari" }}
              width={25.2}
              height={41.2}
            />
            <Card
              cardData={{ month: 8, name: "hikari" }}
              width={25.2}
              height={41.2}
            />
            <Card
              cardData={{ month: 11, name: "hikari" }}
              width={25.2}
              height={41.2}
            />
          </div>
        </li>
        <li className={styles.yaku}>
          <span>
            <strong>5</strong> Red Poetry Tanzaku
          </span>
          <div>
            <Card
              cardData={{ month: 1, name: "tanzaku" }}
              width={25.2}
              height={41.2}
            />
            <Card
              cardData={{ month: 2, name: "tanzaku" }}
              width={25.2}
              height={41.2}
            />
            <Card
              cardData={{ month: 3, name: "tanzaku" }}
              width={25.2}
              height={41.2}
            />
          </div>
        </li>
      </ul>
      <div className={`${styles.plus} clickable main-button`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-plus"
          viewBox="0 0 16 16"
        >
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
        </svg>
      </div>
    </div>
  );
};

export default ScorePile;
