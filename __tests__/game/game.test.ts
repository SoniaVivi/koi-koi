import { Card, CardSet, sortCardsFunc } from "../../game/deck";
import gameFactory, { OyaRound, SetupRound } from "../../game/game";

describe("game.chooseOya, game.setup", () => {
  const game = gameFactory();
  let hasChoosenOya = false;
  test.each(game.chooseOya())("%s", (current: OyaRound) => {
    const result: number = [
      current["playerOne"].oya,
      current["playerTwo"].oya,
    ].filter((e) => e == true).length;
    expect(hasChoosenOya).toBe(false);
    expect(result).toBeLessThan(2);
    if (result == 1) {
      hasChoosenOya = true;
    }
  });

  it("has choosen the oya", () => {
    expect(hasChoosenOya).toBe(true);
  });

  it("returns the oya", () => {
    expect(game.getOya()).toMatch(/[(playerOne)(playerTwo)]/);
  });

  let prev: SetupRound = {
    deckCount: 48,
    playerOne: [],
    playerTwo: [],
    playingField: [],
    suppliedEntity: game.getOya(),
  };
  let i = 0;

  const turnOrder: Array<"playerOne" | "playerTwo" | "playingField"> = [
    game.getKo(),
    "playingField",
    game.getOya(),
  ];

  test.each(game.setup())("%s", (current: SetupRound) => {
    const changedHands = turnOrder.reduce(
      (total: string[], str): string[] =>
        current[str].length != prev[str].length ? [...total, str] : total,
      []
    );

    expect(changedHands.length).toEqual(1);
    expect(current["suppliedEntity"]).toEqual(changedHands[0]);
    expect(current["suppliedEntity"]).toEqual(turnOrder[i % 3]);

    expect(
      current[current["suppliedEntity"]].length -
        prev[current["suppliedEntity"]].length
    ).toEqual(2);

    expect(current["deckCount"] - prev["deckCount"]).toEqual(-2);

    prev = {
      ...current,
      playerOne: [...current["playerOne"]],
      playerTwo: [...current["playerTwo"]],
    };
    i += 1;
  });
});

describe("gameplay logic", () => {
  const game = gameFactory(true);
  game.chooseOya();
  game.setup();

  // Still Need: checking for lucky hands, Yaku formation,
  // yaku improvement, Ko turn, Koi-koi && Shobu, scoring

  it("begins with the Oya", () => {
    expect(game.getCurrentPlayer()).toEqual(game.getOya());
  });

  test.each(["First Card", "drawpile card"])("%s", (current: string) => {
    if (current == "First Card") {
      expect(game.getCardToPlay()).toEqual(null);
    }

    expect(game.getCardToMatch()).toEqual(null);

    const cardToPlay: Card =
      current == "First Card" ? game.getCardSet("oya")[0] : game.draw();

    const matches: CardSet = game
      .getCardSet("playingField")
      .reduce(
        (totalMatches: CardSet, currentCard: Card) =>
          currentCard["month"] == cardToPlay["month"]
            ? [...totalMatches, currentCard]
            : totalMatches,
        []
      );

    expect((game.play({ ...cardToPlay } as Card) as CardSet).sort()).toEqual(
      [cardToPlay, ...matches].sort()
    );

    if (matches.length == 1 || matches.length == 3) {
      expect(game.getScorePile("oya").slice(-2).sort(sortCardsFunc)).toEqual(
        [cardToPlay, ...matches].sort(sortCardsFunc)
      );
    } else if (matches.length == 2) {
      if (current == "First Card") {
        expect(game.getScorePile("oya")).toEqual([]);
      }

      const randInt = Math.floor(Math.random() * 2);
      game.play({ ...matches[randInt] });
      expect(game.getScorePile("oya").slice(-2).sort()).toEqual(
        [matches[randInt], cardToPlay].sort()
      );
    } else {
      expect(
        !!game
          .getHand("playingField")
          .find(
            (card: Card) =>
              card["month"] == cardToPlay["month"] &&
              card["name"] == cardToPlay["name"]
          )
      ).toEqual(true);
    }
  });
});
