export interface Card {
  name: "hikari" | "tanzaku" | "tane" | "kasu";
  month: number;
}

export type CardSet = Array<Card>;

export type MonthFormat = {
  [index: string]: number | undefined;
  kasu: number;
  hikari?: number;
  tane?: number;
  tanzaku?: number;
};

export const completeDeck: Array<MonthFormat> = [
  { hikari: 1, tanzaku: 1, kasu: 2 },
  { tane: 1, tanzaku: 1, kasu: 2 },
  { hikari: 1, tanzaku: 1, kasu: 2 },
  { tane: 1, tanzaku: 1, kasu: 2 },
  { tane: 1, tanzaku: 1, kasu: 2 },
  { tane: 1, tanzaku: 1, kasu: 2 },
  { tane: 1, tanzaku: 1, kasu: 2 },
  { hikari: 1, tane: 1, kasu: 2 },
  { tane: 1, tanzaku: 1, kasu: 2 },
  { tane: 1, tanzaku: 1, kasu: 2 },
  { hikari: 1, tane: 1, tanzaku: 1, kasu: 1 },
  { hikari: 1, kasu: 3 },
];

export const sameCard = (a: Card, b: Card | null): boolean =>
  b !== null && a["month"] == b["month"] && a["name"] == b["name"];

export const duplicateCardSet = (cardSet: CardSet): CardSet =>
  cardSet.map((card: Card) => ({ ...card }));

const scoresByName = { hikari: 20, tane: 10, tanzaku: 5, kasu: 1 };

export const sortCardsFunc = (a: Card, b: Card): number =>
  a["month"] < b["month"]
    ? -1
    : b["month"] < a["month"]
    ? 1
    : scoresByName[a["name"]] > scoresByName[b["name"]]
    ? -1
    : scoresByName[b["name"]] > scoresByName[a["name"]]
    ? 1
    : 0;

const deck = ({ hideCards = true } = {}) => {
  const shuffle = (): void => {
    cards = [...cards, ...discardedCards]
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    discardedCards = [];
  };
  let cards: Array<Card> = (() => {
    let temp: Array<Card> = [];
    completeDeck.forEach((data: MonthFormat, i: number) => {
      ["hikari", "tanzaku", "tane", "kasu"].forEach(
        (cardName: keyof MonthFormat) => {
          for (let x = 0; x < (data[cardName] ?? -1); x += 1)
            temp.push({
              name: cardName as "hikari" | "tanzaku" | "tane" | "kasu",
              month: i + 1,
            });
        }
      );
    });
    return temp;
  })();
  let discardedCards: Array<Card> = [];
  shuffle();

  const list = (): Array<MonthFormat> => completeDeck;
  const count = (): number => cards.length;
  const drawCard = (): Card | null => {
    if (count() == 0) return null;
    const temp: Card = cards.splice(0, 1)[0];
    discardedCards.push(temp);
    return temp;
  };
  const getDiscardedCards = (): Array<Card> => [...discardedCards];
  const luckyHandShuffle = () => {
    let temp = [...cards, ...discardedCards].sort((a, b) => a.month - b.month);
    cards = [];
    let i = 0;
    let pos = 0;
    while (temp.length != 0) {
      if (i == 2) {
        pos = 0;
        i = 0;
      }
      cards = [...cards, ...temp.splice(pos, 2)];
      pos = i == 0 ? (pos = 2) : (pos = 4);
      i += 1;
    }
    discardedCards = [];
  };

  return {
    count,
    list,
    shuffle,
    get cards() {
      return hideCards ? list() : [...cards];
    },
    drawCard,
    getDiscardedCards,
    luckyHandShuffle: hideCards ? shuffle : luckyHandShuffle,
  };
};

export default deck;
