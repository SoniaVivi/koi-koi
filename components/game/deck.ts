export interface Card {
  name: string;
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

const deck = ({ hideCards = true }) => {
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
            temp.push({ name: cardName as string, month: i + 1 });
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

  return {
    count,
    list,
    shuffle,
    cards: hideCards ? list() : cards,
    drawCard,
    getDiscardedCards,
  };
};

export default deck;
