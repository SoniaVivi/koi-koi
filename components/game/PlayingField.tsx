import styles from "../../styles/game/PlayingField.module.scss";
import Card from "./Card";

const PlayingField = () => {
  return (
    <div className={styles.container}>
      <Card cardData={{ month: 1, name: "kasu" }} />
      <Card cardData={{ month: 1, name: "kasu" }} />
      <Card cardData={{ month: 1, name: "kasu" }} />
      <Card cardData={{ month: 1, name: "kasu" }} />
      <Card cardData={{ month: 1, name: "kasu" }} />
      <Card cardData={{ month: 1, name: "kasu" }} />
      <Card cardData={{ month: 1, name: "kasu" }} />
      <Card cardData={{ month: 1, name: "kasu" }} />
    </div>
  );
};

export default PlayingField;
