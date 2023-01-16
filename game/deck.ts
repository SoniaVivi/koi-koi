const deck = () => {
  type Card = { name: string; month: number };
  const cards: Array<Card> = [];

  return { cards };
};

export default deck;
