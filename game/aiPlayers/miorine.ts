import { Card, CardSet, AIPlayer } from "../gameTypes";

const getMatches = (
  cardHand: CardSet,
  playingField: CardSet
): Array<{ handCard: Card; matchCards: CardSet }> => {
  const searchedMonths: { [key: number]: CardSet } = {};
  const result: Array<{ handCard: Card; matchCards: CardSet }> = [];

  cardHand.forEach((handCard) => {
    if (handCard.month in searchedMonths) {
      if (searchedMonths[handCard.month].length > 0) {
        result.push({ handCard, matchCards: searchedMonths[handCard.month] });
      }

      return;
    }

    const totalMatches = playingField.reduce(
      (total: CardSet, currentCard: Card) => {
        if (currentCard.month == handCard.month) {
          total.push(currentCard);
        }
        return total;
      },
      [] as CardSet
    );

    searchedMonths[handCard.month] = totalMatches;

    if (totalMatches.length > 0) {
      result.push({ handCard, matchCards: totalMatches });
    }
  });

  return result;
};

const rankCards = (hand: CardSet): CardSet =>
  hand.sort((a: Card, b: Card) => {
    const scores = { kasu: 1, tanzaku: 5, tane: 10, hikari: 20 };
    if (scores[a.name] >= scores[b.name]) {
      return 1;
    } else {
      return -1;
    }
  });

const selectCardsToMatch = (hand: CardSet): null | Card =>
  hand.length <= 1 || hand.length === 3
    ? null
    : rankCards(hand)[hand.length - 1];

const miorine: AIPlayer = ({
  name,
  cardHand,
  playingField,
  matchedCards,
  currentPlayer,
  phase,
  cardToPlay,
  cardToMatch,
}) => {
  if (currentPlayer != name) return {};

  if (phase.toLowerCase().includes("round call")) {
    if (Math.floor(Math.random() * 100) + 1 < 64) {
      return { roundAction: "koiKoi" };
    } else {
      return { roundAction: "shoubuOrNextTurn" };
    }
  } else if (
    phase.toLowerCase().includes("draw") &&
    cardToPlay == null &&
    cardToMatch == null
  ) {
    return {
      drawCard: true,
    };
  }

  const matches = getMatches(
    cardToMatch ? [cardToMatch] : cardHand,
    playingField
  );

  switch (matches.length) {
    case 0: {
      return {
        playCard: rankCards(cardHand)[0],
        matchCard: null,
      };
    }
    default: {
      const index = Math.floor(Math.random() * matches.length);
      return {
        discardCard: false,
        playCard: matches[index].handCard,
        matchCard: selectCardsToMatch(matches[index].matchCards),
      };
    }
  }
};

export default miorine;
