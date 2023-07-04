import { Card as CardInterface, PlayerNames } from "../../game/gameTypes";
import Image from "next/image";
import monthNames from "../helpers/monthNames";
import { defaultCardSize } from "./variables";
import styles from "../../styles/game/Card.module.scss";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";

const Card = (
  props:
    | {
        cardData: CardInterface;
        showBackSide?: boolean;
        width?: number;
        height?: number;
        className?: string;
        showMatchIndicator?: boolean;
        onClick?: () => any;
      }
    | {
        invisible: true;
        width?: number;
        height?: number;
      }
) => {
  const [showMatchIndicator, setShowMatchIndicator] = useState(false);
  const playingField = useAppSelector(
    (state) => state.game.cardHands.playingField
  );

  useEffect(() => {
    if (!("showMatchIndicator" in props) || !props.showMatchIndicator) return;
    setShowMatchIndicator(
      playingField.some((fieldCard) => fieldCard.month == props.cardData.month)
    );

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playingField]);

  if ("invisible" in props) {
    return <div className={styles.blank}></div>;
  }

  const src = props.showBackSide
    ? "/cardImages/backside.png"
    : `/cardImages/${monthNames[props.cardData["month"] - 1]}${
        props.cardData["name"].slice(0, 1).toUpperCase() +
        props.cardData["name"].slice(1)
      }${props.cardData["name"] == "kasu" ? "A" : ""}.png`;

  const altText = props.showBackSide
    ? "Backside of Koi Koi card"
    : `${monthNames[props.cardData["month"] - 1]} ${props.cardData["name"]}`;

  return (
    <Image
      src={src}
      alt={altText}
      width={props.width ?? defaultCardSize.width}
      height={props.height ?? defaultCardSize.height}
      className={`${styles.card} ${props.className ?? ""} ${
        showMatchIndicator ? styles.matchIndicator : ""
      }`}
      data-identity={
        props.showBackSide
          ? ""
          : `${props.cardData.name}_${props.cardData.month}`
      }
      onClick={props.onClick ?? undefined}
    />
  );
};

export default Card;
