import deck, { Card, CardSet } from "./deck";

export type OyaRound = {
  playerOne: { card: Card; oya: boolean };
  playerTwo: { card: Card; oya: boolean };
};

export type OyaResult = Array<OyaRound>;

export type SetupRound = {
  deckCount: number;
  playerOne: CardSet;
  playerTwo: CardSet;
  playingField: CardSet;
  suppliedEntity: "playerOne" | "playerTwo" | "playingField";
};

const game = (() => {
  const drawPile = deck({ hideCards: true });
  const cardHands: {
    playerOne: CardSet;
    playerTwo: CardSet;
    playingField: CardSet;
  } = { playerOne: [], playerTwo: [], playingField: [] };
  let _oya: keyof typeof cardHands = "playingField";
  let _ko: keyof typeof cardHands = "playingField";
  let _gamePhase = "chooseOya";

  const setPhase = (caller: string) => {
    const phases: Array<string> = ["chooseOya", "setup", "gameplay"];
    if (caller == _gamePhase) {
      _gamePhase = phases[phases.indexOf(_gamePhase) + 1];
    }
  };

  const chooseOya = (): OyaResult => {
    let result: OyaResult = [];
    while (_oya == "playingField") {
      if (drawPile.count() == 0) {
        drawPile.shuffle();
      }
      const a = drawPile.drawCard() as Card;
      const b = drawPile.drawCard() as Card;
      getOyaWinner(a, b);

      result = [
        ...result,
        {
          playerOne: { card: a, oya: _oya == ("playerOne" as string) },
          playerTwo: { card: b, oya: _oya == ("playerTwo" as string) },
        },
      ];
    }

    setPhase("chooseOya");

    return result;
  };

  const getOyaWinner = (a: Card, b: Card): void => {
    const score: { [index: string]: number } = {
      hikari: 20,
      tane: 10,
      tanzaku: 5,
      kasu: 1,
    };
    if (a.month < b.month) {
      _oya = "playerOne";
    } else if (a.month > b.month) {
      _oya = "playerTwo";
    } else if (score[a.name] > score[b.name]) {
      _oya = "playerOne";
    } else if (score[a.name] < score[b.name]) {
      _oya = "playerTwo";
    }
    _ko = _oya == "playerOne" ? "playerTwo" : "playerOne";
  };

  const setup = (): Array<SetupRound> => {
    if (_gamePhase != "setup") return [];
    drawPile.shuffle();
    let result: Array<SetupRound> = [];
    let order: Array<keyof typeof cardHands> = [_ko, "playingField", _oya];

    for (let x = 0; x < 12; x += 1) {
      const currentPlayer = order[x % 3];
      cardHands[currentPlayer] = [
        ...cardHands[currentPlayer],
        drawPile.drawCard() as Card,
        drawPile.drawCard() as Card,
      ];
      result = [
        ...result,
        {
          suppliedEntity: currentPlayer,
          playerOne: cardHands[_oya == "playerOne" ? _oya : _ko],
          playerTwo: cardHands[_oya == "playerTwo" ? _oya : _ko],
          deckCount: drawPile.count(),
          playingField: cardHands["playingField"],
        },
      ];
    }

    setPhase("setup");

    return result;
  };

  const getCardSet = (cardSetName: string) => {
    switch (cardSetName) {
      case "oya": {
        return cardHands[_oya];
      }
      case "ko": {
        return cardHands[_ko];
      }
      case "playingField": {
        return cardHands["playingField"];
      }
    }
  };

  return {
    getOya: (): "playerOne" | "playerTwo" => _oya as "playerOne" | "playerTwo",
    getKo: (): "playerOne" | "playerTwo" => _ko as "playerOne" | "playerTwo",
    chooseOya,
    setup,
    hasChoosenOya: () => _oya != "playingField",
    getCardSet,
  };
})();

export default game;
