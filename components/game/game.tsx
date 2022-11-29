import deck, { Card, CardSet, duplicateCardSet } from "./deck";

export type OyaRound = {
  playerOne: { card: Card; oya: boolean };
  playerTwo: { card: Card; oya: boolean };
};

export type OyaResult = Array<OyaRound>;

export type PlayerNames = "playerOne" | "playerTwo";

export type SetupRound = {
  deckCount: number;
  playerOne: CardSet;
  playerTwo: CardSet;
  playingField: CardSet;
  suppliedEntity: PlayerNames | "playingField";
};

export type PlayerRole = "oya" | "ko";

const game = (testMode = false) => {
  type PlayerCardSets = {
    playerOne: CardSet;
    playerTwo: CardSet;
  };
  const drawPile = deck({ hideCards: true });
  const cardHands: PlayerCardSets & {
    playingField: CardSet;
  } = { playerOne: [], playerTwo: [], playingField: [] };
  const scorePiles: PlayerCardSets = { playerOne: [], playerTwo: [] };
  type CardHandKeys = keyof typeof cardHands;
  let _oya: CardHandKeys = "playingField";
  let _ko: CardHandKeys = "playingField";
  let _gamePhase: string | number = "chooseOya";
  let _cardToMatch: Card | null = null;
  let _cardToPlay: Card | null = null;
  let _currentTurn: PlayerRole = "oya";

  const setPhase = (caller: string | number) => {
    const phases: Array<string | number> = [
      "chooseOya",
      "setup",
      "oya hand play",
      "oya draw play",
      "oya yaku check",
      "oya round call",
      "ko hand play",
      "ko draw play",
      "ko yaku check",
      "ko round call",
    ];
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
    let order: Array<CardHandKeys> = [_ko, "playingField", _oya];

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

  const getCardSet = (cardSetName: string): CardSet => {
    switch (cardSetName) {
      case "oya": {
        return duplicateCardSet(cardHands[_oya]);
      }
      case "ko": {
        return duplicateCardSet(cardHands[_ko]);
      }
      case "playingField": {
        return duplicateCardSet(cardHands["playingField"]);
      }
      default: {
        return [];
      }
    }
  };

  const setCardHand = (playerName: CardHandKeys, cardHand: CardSet) =>
    (cardHands[playerName] = duplicateCardSet(cardHand));

  const getCardToMatch = (): Card | null =>
    _cardToMatch !== null ? { ..._cardToMatch } : null;

  const getCardToPlay = (): Card | null =>
    _cardToPlay !== null ? { ..._cardToPlay } : null;

  const getNameFromRole = (role: string) => (role == "oya" ? _oya : _ko);

  const getCurrentPlayer = () => getNameFromRole(_currentTurn) as PlayerNames;

  const play = (selectedCard: Card | null): CardSet => {
    if (_cardToMatch && selectedCard) {
      return matchCard(selectedCard);
    }

    const currentCard = _cardToPlay ?? selectedCard;
    if (currentCard === null) {
      return [];
    }
    if (_cardToPlay !== null) {
      cardHands[getCurrentPlayer()] = [
        ...cardHands[getCurrentPlayer()],
        { ..._cardToPlay },
      ];
      _cardToPlay = null;
    }

    const temp = playCard(currentCard) ?? [];
    _cardToMatch === null ? setPhase(_gamePhase) : null;
    return temp;
  };

  const matchCard = (selectedCard: Card): CardSet => {
    if (
      _cardToMatch == null ||
      selectedCard["month"] != _cardToMatch["month"] ||
      !cardInHand("playingField", selectedCard)
    )
      return [];

    handToScorePile("playingField", getCurrentPlayer(), [selectedCard]);
    scorePiles[getCurrentPlayer()] = [
      ...scorePiles[getCurrentPlayer()],
      { ..._cardToMatch },
    ];
    const temp = [{ ...selectedCard }, { ..._cardToMatch }];
    _cardToMatch = null;
    setPhase(_gamePhase);
    return temp;
  };

  const draw = (): Card => {
    const temp = drawPile.drawCard() as Card;
    _cardToPlay = temp;
    return { ...temp };
  };

  const playCard = (selectedCard: Card): null | CardSet => {
    if (
      cardHands[getCurrentPlayer()].findIndex((card) =>
        sameCard(selectedCard, card)
      ) == -1
    ) {
      return null;
    }
    const matches: CardSet = getMatches(selectedCard);

    if (matches.length == 1 || matches.length == 3) {
      handToScorePile("playingField", getCurrentPlayer(), matches);
      handToScorePile(getCurrentPlayer(), getCurrentPlayer(), [selectedCard]);
    } else if (matches.length == 0) {
      cardHands["playingField"] = [
        ...cardHands["playingField"],
        removeCard(getCurrentPlayer(), selectedCard),
      ];
    } else {
      _cardToMatch = removeCard(getCurrentPlayer(), selectedCard);
    }

    return [selectedCard, ...duplicateCardSet(matches)];
  };

  const handToScorePile = (
    origin: PlayerNames | "playingField",
    destination: PlayerNames,
    cards: CardSet
  ) =>
    cards.forEach(
      (card: Card) =>
        (scorePiles[destination] = [
          ...scorePiles[destination],
          removeCard(origin, card),
        ])
    );

  const removeCard = (hand: PlayerNames | "playingField", card: Card): Card =>
    cardHands[hand].splice(
      cardHands[hand].findIndex((c: Card) => {
        return sameCard(c, card);
      }),
      1
    )[0];

  const getMatches = (card: Card): CardSet =>
    getCardSet("playingField").reduce(
      (totalMatches: CardSet, currentCard: Card) =>
        currentCard["month"] == card["month"]
          ? [...totalMatches, currentCard]
          : totalMatches,
      []
    );

  const sameCard = (a: Card, b: Card | null): boolean =>
    b !== null && a["month"] == b["month"] && a["name"] == b["name"];

  const getScorePile = (role: PlayerRole): CardSet =>
    scorePiles[getNameFromRole(role) as PlayerNames];

  const cardInHand = (
    hand: PlayerNames | "playingField",
    card: Card
  ): boolean => cardHands[hand].findIndex((c: Card) => sameCard(c, card)) != -1;

  return {
    getOya: (): PlayerNames => _oya as PlayerNames,
    getKo: (): PlayerNames => _ko as PlayerNames,
    chooseOya,
    setup,
    hasChoosenOya: () => _oya != "playingField",
    getCardSet,
    getHand: (playerName: CardHandKeys): CardSet =>
      duplicateCardSet(cardHands[playerName]),
    ...(testMode ? { setCardHand } : {}),
    getCardToMatch,
    getCurrentPlayer,
    getScorePile,
    play,
    draw,
    getCardToPlay,
  };
};

export default game;
