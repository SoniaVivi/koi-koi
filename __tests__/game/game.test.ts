import { Card } from "../../components/game/deck";
import game, { OyaRound, SetupRound } from "../../components/game/game";

describe("game", () => {
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
