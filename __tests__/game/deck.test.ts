import deck, { completeDeck } from "../../game/deck";

describe("Deck", () => {
  const hanafudaDeck = deck();
  it("returns number of cards", () => {
    expect(deck.count()).toEqual(48);
  });
});
