import { sameCard } from "./deck";
import { Card, CardSet } from "./gameTypes";

// { [month]: { [cardName]: # of instances } }
type TabulatedCards = { [index: number]: { [index: string]: number } };
type YakuIdentifierType = (cards: TabulatedCards) => number;
type YakuScore = Array<[string, number]> | [];
// Ijou is Japanese for "not less than"
type IjouArray = Array<{ month: number; name: string; count: number }>;
type IjouOutput = { month: number; name: string; value: boolean };

const yakuIdentifiers: { [index: string]: YakuIdentifierType } = {
  fiveHikari: (cards) =>
    allCardsIjou(cards, [
      { month: 1, name: "hikari", count: 1 },
      { month: 3, name: "hikari", count: 1 },
      { month: 8, name: "hikari", count: 1 },
      { month: 11, name: "hikari", count: 1 },
      { month: 12, name: "hikari", count: 1 },
    ])
      ? 15
      : 0,
  fourHikari: (cards) =>
    allCardsIjou(cards, [
      { month: 1, name: "hikari", count: 1 },
      { month: 3, name: "hikari", count: 1 },
      { month: 8, name: "hikari", count: 1 },
      { month: 12, name: "hikari", count: 1 },
    ])
      ? 8
      : 0,
  rainyFourHikari: (cards) =>
    totalCardsIjou(cards, [
      { month: 1, name: "hikari", count: 1 },
      { month: 3, name: "hikari", count: 1 },
      { month: 8, name: "hikari", count: 1 },
      { month: 12, name: "hikari", count: 1 },
    ]) >= 3 && cardPresent(cards, { month: 11, name: "hikari" })
      ? 7
      : 0,
  threeHikari: (cards) =>
    totalCardsIjou(cards, [
      { month: 1, name: "hikari", count: 1 },
      { month: 3, name: "hikari", count: 1 },
      { month: 8, name: "hikari", count: 1 },
      { month: 12, name: "hikari", count: 1 },
    ]) >= 3
      ? 6
      : 0,
  kasu: (cards) => {
    const score = getCardTypeOccurrences(cards, "kasu") - 9;
    return score > 0 ? score : 0;
  },
  moonViewing: (cards) =>
    allCardsPresent(cards, [
      { month: 8, name: "hikari" },
      { month: 9, name: "tane" },
    ])
      ? 5
      : 0,
  cherryBlossomViewing: (cards) =>
    allCardsPresent(cards, [
      { month: 3, name: "hikari" },
      { month: 9, name: "tane" },
    ])
      ? 5
      : 0,
  boarDeerButterflies: (cards) =>
    allCardsPresent(cards, [
      { month: 6, name: "tane" },
      { month: 7, name: "tane" },
      { month: 10, name: "tane" },
    ])
      ? 5
      : 0,
  tane: (cards) => {
    const score = getCardTypeOccurrences(cards, "tane") - 4;
    return score > 0 ? score : 0;
  },
  redPoetryTanzaku: (cards) =>
    allCardsPresent(cards, [
      { month: 1, name: "tanzaku" },
      { month: 2, name: "tanzaku" },
      { month: 3, name: "tanzaku" },
    ])
      ? 5
      : 0,
  blueTanzaku: (cards) =>
    allCardsPresent(cards, [
      { month: 6, name: "tanzaku" },
      { month: 9, name: "tanzaku" },
      { month: 10, name: "tanzaku" },
    ])
      ? 5
      : 0,
  combinedRedPoetryAndBlueTanzaku: (cards) =>
    allCardsPresent(cards, [
      { month: 1, name: "tanzaku" },
      { month: 2, name: "tanzaku" },
      { month: 3, name: "tanzaku" },
      { month: 6, name: "tanzaku" },
      { month: 9, name: "tanzaku" },
      { month: 10, name: "tanzaku" },
    ])
      ? 10
      : 0,
  tanzaku: (cards) => {
    const score = getCardTypeOccurrences(cards, "tanzaku") - 4;
    return score > 0 ? score : 0;
  },
  monthlyCards: (cards) =>
    Object.values(cards).find(
      (monthData: { [index: string]: number }): boolean =>
        Object.keys(monthData).reduce(
          (total: number, cardName: string) => total + monthData[cardName],
          0
        ) == 4
    )
      ? 4
      : 0,
};

const getCardTypeOccurrences = (cards: TabulatedCards, type: string): number =>
  Object.values(cards).reduce(
    (prev: number, current: { [index: string]: number }) =>
      current[type] !== undefined ? prev + current[type] : prev,
    0
  );

const cardPresent = (
  cards: TabulatedCards,
  { month, name }: { month: number; name: string }
): boolean => cards[month] !== undefined && cards[month][name] !== undefined;

const allCardsPresent = (cards: TabulatedCards, cardCheck: CardSet): boolean =>
  !cardCheck.find((current) => !cardPresent(cards, current));

const totalCardsIjou = (
  cardCounts: TabulatedCards,
  cardCheck: IjouArray
): number =>
  cardsIjou(cardCounts, cardCheck).reduce(
    (total, current) => (current.value ? total + 1 : total),
    0
  );

const allCardsIjou = (
  cardCounts: TabulatedCards,
  cardCheck: IjouArray
): boolean =>
  !cardsIjou(cardCounts, cardCheck).find(
    (currentCard) => currentCard.value == false
  );

const cardsIjou = (
  cardCounts: TabulatedCards,
  cardCheck: IjouArray
): Array<IjouOutput> =>
  cardCheck.map(
    ({
      month,
      name,
      count,
    }): { month: number; name: string; value: boolean } => {
      return {
        month,
        name,
        value:
          cardCounts[month] !== undefined &&
          cardCounts[month][name] !== undefined &&
          cardCounts[month][name] >= count,
      };
    }
  );

const tabulateCards = (cards: CardSet) =>
  cards.reduce(
    (total: TabulatedCards, { month, name }: Card): TabulatedCards => ({
      ...total,
      [month]: {
        ...total[month],
        [name]:
          (total[month] !== undefined && total[month][name] !== undefined
            ? total[month][name]
            : 0) + 1,
      },
    }),
    {}
  );

export const identifyYaku = (cards: CardSet): YakuScore => {
  if (cards.length == 0) return [];
  const counted_cards: TabulatedCards = tabulateCards(cards);

  let temp: YakuScore = [];
  Object.entries(yakuIdentifiers).forEach(
    ([name, yakuIdentifier]: [
      name: string,
      yakuIdentifier: YakuIdentifierType
    ]) => {
      const score: number = yakuIdentifier(counted_cards);
      if (score == 0) return;
      temp = [...temp, [name, score]];
    }
  );

  return temp;
};

export const getYakuCardIndices = (
  yakuCombination: keyof typeof yakuIdentifiers,
  cards: CardSet
): number[] => {
  const findIndices = (yaku: Array<Card>, limit = 999999): number[] =>
    yaku.reduce((matches: number[], currentCard: Card): number[] => {
      const index = cards.findIndex((c) => sameCard(c, currentCard));
      if (index != -1 && matches.length < limit) {
        return [...matches, index];
      }
      return matches;
    }, []);
  const findNameIndices = (cardName: Card["name"]) =>
    cards.reduce(
      (result: number[], current: Card, i): number[] =>
        current["name"] == cardName ? [...result, i] : result,
      []
    );

  switch (yakuCombination) {
    case "fiveHikari": {
      return findIndices([
        { month: 1, name: "hikari" },
        { month: 3, name: "hikari" },
        { month: 8, name: "hikari" },
        { month: 11, name: "hikari" },
        { month: 12, name: "hikari" },
      ]);
    }
    case "fourHikari": {
      return findIndices([
        { month: 1, name: "hikari" },
        { month: 3, name: "hikari" },
        { month: 8, name: "hikari" },
        { month: 12, name: "hikari" },
      ]);
    }
    case "rainyFourHikari": {
      return findIndices(
        [
          { month: 11, name: "hikari" },
          { month: 1, name: "hikari" },
          { month: 3, name: "hikari" },
          { month: 8, name: "hikari" },
          { month: 12, name: "hikari" },
        ],
        4
      );
    }
    case "threeHikari": {
      return findIndices(
        [
          { month: 1, name: "hikari" },
          { month: 3, name: "hikari" },
          { month: 8, name: "hikari" },
          { month: 12, name: "hikari" },
        ],
        3
      );
    }
    case "moonViewing": {
      return findIndices([
        { month: 8, name: "hikari" },
        { month: 9, name: "tane" },
      ]);
    }
    case "cherryBlossomViewing": {
      return findIndices([
        { month: 3, name: "hikari" },
        { month: 9, name: "tane" },
      ]);
    }
    case "boarDeerButterflies": {
      return findIndices([
        { month: 6, name: "tane" },
        { month: 7, name: "tane" },
        { month: 10, name: "tane" },
      ]);
    }
    case "redPoetryTanzaku": {
      return findIndices([
        { month: 1, name: "tanzaku" },
        { month: 2, name: "tanzaku" },
        { month: 3, name: "tanzaku" },
      ]);
    }
    case "blueTanzaku": {
      return findIndices([
        { month: 6, name: "tanzaku" },
        { month: 9, name: "tanzaku" },
        { month: 10, name: "tanzaku" },
      ]);
    }
    case "combinedRedPoetryAndBlueTanzaku": {
      return findIndices([
        { month: 1, name: "tanzaku" },
        { month: 2, name: "tanzaku" },
        { month: 3, name: "tanzaku" },
        { month: 6, name: "tanzaku" },
        { month: 9, name: "tanzaku" },
        { month: 10, name: "tanzaku" },
      ]);
    }
    case "kasu": {
      return findNameIndices("kasu");
    }
    case "tane": {
      return findNameIndices("tane");
    }
    case "tanzaku": {
      return findNameIndices("tanzaku");
    }
    case "monthlyCards": {
      return Object.values(
        cards.reduce(
          (
            total: { [index: number]: number[] },
            current: Card,
            i: number
          ): { [index: number]: number[] } => ({
            ...total,
            [current["month"] as number]: [
              ...(total[current["month"]] ?? []),
              i,
            ],
          }),
          {}
        )
      ).filter((x: number[]) => x.length == 4)[0];
    }
  }

  return [];
};
