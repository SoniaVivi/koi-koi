import deck, { completeDeck } from "../../game/deck";

describe("Deck", () => {
  const hanafudaDeck = deck({ hideCards: false });

  it("returns number of cards", () => {
    expect(hanafudaDeck.count()).toEqual(48);
  });

  it("returns a list of all possible cards", () => {
    expect(hanafudaDeck.list()).toMatchObject(completeDeck);
  });

  it("returns cards currently in deck", () => {
    expect(hanafudaDeck.cards.length).toEqual(48);
    expect(
      (
        [
          ...hanafudaDeck.cards
            .map((data) => data.month)
            .filter((month, i, self) => self.indexOf(month) === i),
        ] as number[]
      ).sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))
    ).toEqual(Array.from(Array(12), (_, i) => i + 1));
  });

  it("returns cards in order", () => {
    const copiedDeck = [...hanafudaDeck.cards];
    expect(Array.from(Array(48), () => hanafudaDeck.drawCard())).toEqual(
      copiedDeck
    );
    expect(hanafudaDeck.count()).toEqual(0);
    expect(hanafudaDeck.getDiscardedCards()).toEqual(copiedDeck);
  });

  it("reshuffles discarded cards", () => {
    expect(hanafudaDeck.count()).toEqual(0);
    hanafudaDeck.shuffle();
    expect(hanafudaDeck.count()).toEqual(48);
    expect(hanafudaDeck.getDiscardedCards()).toEqual([]);

    Array.from(Array(26), () => hanafudaDeck.drawCard());
    hanafudaDeck.shuffle();
    expect(hanafudaDeck.count()).toEqual(48);
  });
});
