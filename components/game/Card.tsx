import { Card as CardInterface } from "../../game/deck";
import Image from "next/image";
import monthNames from "../helpers/monthNames";

const Card = (props: {
  cardData: CardInterface;
  showBackSide?: boolean;
  width?: number;
  height?: number;
  className?: string;
}) => {
  const src = props.showBackSide
    ? "/cardImages/backside.png"
    : `/cardImages/${monthNames[props.cardData["month"] - 1]}${
        props.cardData["name"].slice(0, 1).toUpperCase() +
        props.cardData["name"].slice(1)
      }${props.cardData["name"] == "kasu" ? "A" : ""}.png`;

  const altText = props.showBackSide
    ? "Backside of Koi Koi card"
    : `${monthNames[props.cardData["month"]]} ${props.cardData["name"]}`;

  return (
    <Image
      src={src}
      alt={altText}
      width={props.width ?? 63}
      height={props.height ?? 103}
      className={props.className ?? ""}
    />
  );
};

export default Card;
