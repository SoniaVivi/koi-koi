import gameFactory from "../../game/game";

const playFirstCard = (gameInstance: ReturnType<typeof gameFactory>) => {
  let currentCard = gameInstance.getHand("current")[0];
  gameInstance.play(currentCard);
  const matches = gameInstance.matches(gameInstance.cardToMatch);
  if (matches.length == 2) {
    gameInstance.play(matches[Math.floor(Math.random() * 2)]);
  }
};

const playDrawnCard = (gameInstance: ReturnType<typeof gameFactory>) => {
  gameInstance.draw();

  gameInstance.play(gameInstance.cardToPlay);
  const matches = gameInstance.matches(gameInstance.cardToMatch);
  if (matches.length == 2) {
    gameInstance.play(matches[Math.floor(Math.random() * 2)]);
  }
};

const setupGame = (): ReturnType<typeof gameFactory> => {
  const game = gameFactory({ testMode: true, gameLength: "year" });
  game.chooseOya();
  game.setup();
  return game;
};

describe("Test run #1 'Overly eager shoubu caller'", () => {
  it("can properly end a single round", () => {
    const game = setupGame();
    let x = 17;

    while (x > 0) {
      playFirstCard(game);
      playDrawnCard(game);

      if (game.getPotentialScore("current").score > 0) {
        game.shoubu();
        expect(game.phase).toEqual("setup");
        expect(game.scoreModifiers).toEqual({ playerOne: 1.0, playerTwo: 1.0 });
        x = -1;
      } else {
        game.shoubu();
        game.koiKoi();
        expect(game.phase).toMatch(/round call/);
        game.nextTurn();
      }
      x -= 1;
    }
    if (x == 0) {
      expect(game.round).toEqual(2);
      expect(game.phase).toEqual("oya hand play");
    }
  });
});

const playTurn = (gameInstance: ReturnType<typeof gameFactory>) => {
  playFirstCard(gameInstance);
  playDrawnCard(gameInstance);
};

describe("Test run #2: 'Exhaustive draw'", () => {
  const game = setupGame();
  expect(game.round).toEqual(1);

  let x = 16;
  const oya = game.oya;
  const ko = game.ko;

  it("ends round after both players have no cards in hand", async () => {
    const _ = await (async () => {
      while (x > -99) {
        playTurn(game);
        game.koiKoi();
        game.nextTurn();
        x -= 1;
        if (x == 0) {
          return 1;
        }
      }
    })();

    expect(game.getHand("playerOne").length).toEqual(0);
    expect(game.getHand("playerTwo").length).toEqual(0);
    expect(game.round).toEqual(2);
    expect(game.phase).toEqual("setup");
    expect(game.oya).toEqual(oya);
    expect(game.ko).toEqual(ko);
  });
});

describe("Test run #3: 'Round to Round to Test'", () => {
  const game = gameFactory({ gameLength: "season", testMode: true });
  game.chooseOya();
  game.setup();

  let prevRound = 1;
  let timesRoundHasChanged = 0;
  let x = 0;

  it("ends game after 3 rounds", async () => {
    await (async () => {
      while (prevRound < 4 && x < 49) {
        playTurn(game);
        game.shoubu();
        game.nextTurn();
        game.setup();
        timesRoundHasChanged =
          game.round != prevRound
            ? timesRoundHasChanged + 1
            : timesRoundHasChanged;
        prevRound = game.round;
        x += 1;
      }
      return 3;
    })();
    expect(timesRoundHasChanged).toEqual(3);
    expect(game.round).toEqual(-1);
    expect(game.winner).toMatch(/(playerOne)|(playerTwo)|("tie")/);
  });
});
