import { duplicateCardSet, sameCard } from "./deck";
import {
  Card,
  CardHands,
  CardHandsAndPlayerRoles,
  CardSet,
  PlayerNames,
} from "./gameTypes";

const createCardHands = (
  getName: (name: CardHandsAndPlayerRoles) => PlayerNames | "playingField"
): CardHands => {
  const cardHands = {
    playerOne: [] as CardSet,
    playerTwo: [] as CardSet,
    playingField: [] as CardSet,
    replace: (name: CardHandsAndPlayerRoles, newHand: CardSet): CardSet =>
      (cardHands[getName(name)] = duplicateCardSet(newHand)),
    remove: (
      name: CardHandsAndPlayerRoles,
      cards: Card | CardSet
    ): Card | CardSet =>
      cards.constructor === Array
        ? removeMany(name, cards)
        : removeOne(name, cards as Card),
    add: (player: CardHandsAndPlayerRoles, card: Card) =>
      (cardHands[getName(player)] = [
        { ...card },
        ...cardHands[getName(player)],
      ]),

    exists: (name: CardHandsAndPlayerRoles, card: Card): boolean =>
      cardHands[getName(name)].findIndex((c: Card) => sameCard(c, card)) != -1,
    get: (name: CardHandsAndPlayerRoles): CardSet => cardHands[getName(name)],
    duplicate: (name: CardHandsAndPlayerRoles): CardSet =>
      duplicateCardSet(cardHands[getName(name)]),
    getFieldMatches: (card: Card | null): CardSet =>
      cardHands
        .duplicate("playingField")
        .reduce(
          (totalMatches: CardSet, currentCard: Card) =>
            currentCard["month"] == (card?.month ?? -1)
              ? [...totalMatches, currentCard]
              : totalMatches,
          []
        ),
    reset: () => {
      cardHands["playerOne"] = [];
      cardHands["playerTwo"] = [];
      cardHands["playingField"] = [];
    },
    get doPlayersHaveCards() {
      return cardHands.playerOne.length > 0 || cardHands.playerTwo.length > 0;
    },
  };

  const removeOne = (name: CardHandsAndPlayerRoles, card: Card): Card => {
    name = getName(name);
    return cardHands[name].splice(
      cardHands[name].findIndex((c: Card) => {
        return sameCard(c, card);
      }),
      1
    )[0];
  };

  const removeMany = (name: CardHandsAndPlayerRoles, cards: CardSet): CardSet =>
    cards.map((card: Card): Card => removeOne(name, card));

  return cardHands;
};

export default createCardHands;
