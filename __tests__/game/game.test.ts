import { Card, CardSet, sortCardsFunc } from "../../game/deck";
import gameFactory, {
  OyaRound,
  PlayerNames,
  SetupRound,
} from "../../game/game";

describe("game.chooseOya, game.setup", () => {
  const game = gameFactory({ testMode: true });
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
    expect(game.oya).toMatch(/[(playerOne)(playerTwo)]/);
  });

  let prev: SetupRound = {
    deckCount: 48,
    playerOne: [],
    playerTwo: [],
    playingField: [],
    suppliedEntity: game.oya,
  };
  let i = 0;
  let prevHadLuckyHand = false;

  const turnOrder: Array<"playerOne" | "playerTwo" | "playingField"> = [
    game.ko,
    "playingField",
    game.oya,
  ];

  test.each(game.setup({ forceFirstLuckyHand: true }))(
    "%s",
    (current: SetupRound) => {
      if (prevHadLuckyHand) {
        expect(current["deckCount"]).toEqual(46);
        expect(current["suppliedEntity"]).toEqual(turnOrder[0]);
        expect(current[current["suppliedEntity"]].length).toEqual(2);
        expect(current["playingField"].length).toEqual(0);
        prev = {
          ...current,
          playerOne: [...current["playerOne"]],
          playerTwo: [...current["playerTwo"]],
        };
        prevHadLuckyHand = false;
        i += 1;
        return;
      }

      const monthCounts: {
        playerOne: { [index: number]: number };
        playerTwo: { [index: number]: number };
        playingField: { [index: number]: number };
      } = (
        ["playerOne", "playerTwo", "playingField"] as Array<
          PlayerNames | "playingField"
        >
      )
        .map(
          (
            currentHand: PlayerNames | "playingField"
          ): [PlayerNames | "playingField", { [index: number]: number }] => {
            const hand: CardSet = current[currentHand];
            let cardCounts: { [index: number]: number } = {};
            hand.forEach(
              ({ month }) =>
                (cardCounts = {
                  ...cardCounts,
                  [month]: (cardCounts[month] ?? 0) + 1,
                })
            );
            return [currentHand, cardCounts];
          }
        )
        .reduce(
          (
            obj: {
              playerOne: { [index: number]: number };
              playerTwo: { [index: number]: number };
              playingField: { [index: number]: number };
            },
            current: [PlayerNames | "playingField", { [index: number]: number }]
          ) => ({ ...obj, [current[0]]: current[1] }),
          { playerOne: {}, playerTwo: {}, playingField: {} }
        );

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

      Object.values(monthCounts).forEach((countObj) => {
        let totalTwos = 0;
        Object.values(countObj).forEach((count) => {
          if (count == 2) totalTwos += 1;

          count >= 4 || totalTwos == 4
            ? (() => {
                prevHadLuckyHand = true;
                i = 0;
              })()
            : null;
        });
      });
    }
  );
});

describe("gameplay logic", () => {
  const game = gameFactory({ testMode: true });
  game.chooseOya();
  game.setup();

  // Still Need:
  // Koi-koi, scoring

  it("begins with the Oya", () => {
    expect(game.getCurrentPlayer()).toEqual(game.oya);
  });

  test.each(["First Card", "drawpile card"])("%s", (current: string) => {
    if (current == "First Card") {
      expect(game.cardToPlay).toEqual(null);
    }

    expect(game.cardToMatch).toEqual(null);

    const cardToPlay: Card =
      current == "First Card" ? game.getHand("oya")[0] : game.draw();

    const matches: CardSet = game
      .getHand("playingField")
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

  it("replaces score pile", () => {
    game.forceScorePile("playerOne", [
      { month: 1, name: "hikari" },
      { month: 3, name: "hikari" },
      { month: 8, name: "hikari" },
      { month: 11, name: "hikari" },
      { month: 12, name: "hikari" },
    ]);

    expect(game.getScorePile("playerOne")).toEqual([
      { month: 1, name: "hikari" },
      { month: 3, name: "hikari" },
      { month: 8, name: "hikari" },
      { month: 11, name: "hikari" },
      { month: 12, name: "hikari" },
    ]);
  });

  it("returns best possible yaku in scorepile", () => {
    game.forceScorePile("playerOne", [
      { month: 1, name: "hikari" },
      { month: 3, name: "hikari" },
      { month: 8, name: "hikari" },
      { month: 11, name: "hikari" },
      { month: 12, name: "hikari" },
    ]);

    expect(game.getPotentialScore("playerOne")).toEqual({
      score: 15,
      yaku: ["fiveHikari"],
    });

    game.forceScorePile("playerTwo", [
      { month: 1, name: "tanzaku" },
      { month: 2, name: "tanzaku" },
      { month: 3, name: "tanzaku" },
      { month: 6, name: "tanzaku" },
      { month: 9, name: "tanzaku" },
    ]);

    expect(game.getPotentialScore("playerTwo")).toEqual({
      score: 5,
      yaku: ["redPoetryTanzaku"],
    });

    game.forceScorePile("playerTwo", [
      { month: 1, name: "tanzaku" },
      { month: 2, name: "tanzaku" },
      { month: 3, name: "tanzaku" },
      { month: 6, name: "tanzaku" },
      { month: 9, name: "tanzaku" },
      { month: 10, name: "tanzaku" },
    ]);

    expect(game.getPotentialScore("playerTwo")).toEqual({
      score: 10,
      yaku: ["combinedRedPoetryAndBlueTanzaku"],
    });

    game.forceScorePile("playerTwo", [
      { month: 1, name: "hikari" },
      { month: 1, name: "tanzaku" },
      { month: 1, name: "kasu" },
      { month: 1, name: "kasu" },
      { month: 3, name: "hikari" },
      { month: 3, name: "tanzaku" },
      { month: 3, name: "kasu" },
      { month: 3, name: "kasu" },
    ]);

    expect(game.getPotentialScore("playerTwo")).toEqual({
      score: 8,
      yaku: ["monthlyCards", "monthlyCards"],
    });
  });

  it("supports shoubu", () => {
    game.restart();
    game.chooseOya();
    game.setup();
    game.forceScorePile("playerOne", [
      { month: 1, name: "hikari" },
      { month: 3, name: "hikari" },
      { month: 8, name: "hikari" },
      { month: 11, name: "hikari" },
      { month: 12, name: "hikari" },
    ]);

    game.shoubu();
    expect(game.scores["playerOne"]).toEqual(0);
    expect(game.scores["playerTwo"]).toEqual(0);

    game.forcePermitToEndRound;
    game.forceTurn("playerOne", "round call");
    game.shoubu();
    expect(game.scores["playerOne"]).toEqual(15);
    expect(game.scores["playerTwo"]).toEqual(0);

    game.forceScorePile("playerTwo", [
      { month: 1, name: "hikari" },
      { month: 3, name: "hikari" },
      { month: 8, name: "hikari" },
      { month: 11, name: "hikari" },
    ]);

    game.forceScorePile("playerOne", [
      { month: 1, name: "hikari" },
      { month: 3, name: "hikari" },
      { month: 8, name: "hikari" },
      { month: 11, name: "hikari" },
      { month: 12, name: "hikari" },
    ]);

    game.forceTurn("playerTwo", "round call");
    game.shoubu();
    expect(game.scores["playerTwo"]).toEqual(7);
    expect(game.scores["playerOne"]).toEqual(15);
  });

  it("supports koi-koi", () => {
    game.restart();
    game.chooseOya();
    game.setup();

    game.forceScorePile("playerOne", [
      { month: 1, name: "hikari" },
      { month: 3, name: "hikari" },
      { month: 8, name: "hikari" },
      { month: 11, name: "hikari" },
      { month: 12, name: "hikari" },
    ]);

    game.forceScorePile("playerTwo", [
      { month: 1, name: "hikari" },
      { month: 3, name: "hikari" },
      { month: 8, name: "hikari" },
      { month: 11, name: "hikari" },
    ]);

    game.forcePermitToEndRound;
    game.forceTurn("playerOne", "round call");

    expect(game.scores["playerOne"]).toEqual(0);
    expect(game.scores["playerTwo"]).toEqual(0);
    expect(game.getScorePile("playerOne")).toEqual([
      { month: 1, name: "hikari" },
      { month: 3, name: "hikari" },
      { month: 8, name: "hikari" },
      { month: 11, name: "hikari" },
      { month: 12, name: "hikari" },
    ]);
    expect(game.getScorePile("playerTwo")).toEqual([
      { month: 1, name: "hikari" },
      { month: 3, name: "hikari" },
      { month: 8, name: "hikari" },
      { month: 11, name: "hikari" },
    ]);

    game.forceTurn("playerOne", "round call");
    game.koiKoi();
    game.forceTurn("playerOne", "round call");
    game.forcePermitToEndRound;
    game.shoubu();
    expect(game.scores["playerOne"]).toEqual(30);
    expect(game.scores["playerTwo"]).toEqual(0);
    expect(game.getScorePile("playerOne")).toEqual([]);
    expect(game.getScorePile("playerTwo")).toEqual([]);

    game.forceScorePile("playerOne", [
      { month: 1, name: "hikari" },
      { month: 3, name: "hikari" },
      { month: 8, name: "hikari" },
      { month: 11, name: "hikari" },
      { month: 12, name: "hikari" },
    ]);
    game.forceTurn("playerOne", "round call");
    game.shoubu();
    expect(game.scores["playerOne"]).toEqual(45);
    expect(game.scores["playerTwo"]).toEqual(0);
  });
});
