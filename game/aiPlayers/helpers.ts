import { AIAction, Card, CardSet, GamePhases } from "../gameTypes";

export const playRoundCallAndDraw = ({
  phase,
  cardToPlay,
  cardToMatch,
  callKoiKoi,
}: {
  phase: GamePhases;
  cardToPlay: Card | null;
  cardToMatch: Card | null;
  callKoiKoi: () => boolean;
}): AIAction | null => {
  if (phase.toLowerCase().includes("round call")) {
    if (callKoiKoi()) {
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

  return null;
};

export const getMatches = (
  cardHand: CardSet,
  playingField: CardSet
): Array<{ handCard: Card; matchCards: CardSet }> => {
  const result: Array<{ handCard: Card; matchCards: CardSet }> = [];
  const playingFieldCards = playingField.reduce(
    (cards: { [index: number]: CardSet }, current) => {
      if (current.month in cards) {
        cards[current.month].push(current);
      } else {
        cards[current.month] = [current];
      }
      return cards;
    },
    {}
  );

  cardHand.forEach((handCard) => {
    if (handCard.month in playingFieldCards) {
      result.push({ handCard, matchCards: playingFieldCards[handCard.month] });
    }
  });

  return result;
};
