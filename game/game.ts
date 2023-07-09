import createCardHands from "./createCardHands";
import createScorePiles from "./createScorePiles";
import createTurnCounter from "./createTurnCounter";
import deck, { duplicateCardSet, sameCard } from "./deck";
import {
  Card,
  CardHands,
  CardHandsAndPlayerRoles,
  CardSet,
  GameLengths,
  OyaResult,
  PlayerAliases,
  PlayerNames,
  PlayerRole,
  ScorePiles,
  SetupRound,
} from "./gameTypes";

const game = ({ testMode = false, gameLength = "year" } = {}) => {
  // Instance variables and player getters
  const drawPile = deck({ hideCards: !testMode });
  let _oya: CardHandKeys = "playingField";
  let _ko: CardHandKeys = "playingField";
  let _cardToMatch: Card | null = null;
  let _cardToPlay: Card | null = null;
  let winner: PlayerNames | "tie" | "" = "";
  let roundLimit: number = { year: 12, halfYear: 6, season: 3 }[
    gameLength as GameLengths
  ];

  const getName = (
    name: CardHandsAndPlayerRoles
  ): PlayerNames | "playingField" => {
    if ((["oya", "ko"] as Array<PlayerRole>).includes(name as PlayerRole)) {
      return getNameFromRole(name) as PlayerNames;
    } else if (name == "current") {
      return getNameFromRole(turnCounter.currentPlayer) as PlayerNames;
    } else if (name == "opponent") {
      return (getName("current") as PlayerNames) == "playerOne"
        ? "playerTwo"
        : "playerOne";
    }

    return name as PlayerNames | "playingField";
  };

  let cardHands: CardHands = createCardHands(getName);
  let scorePiles: ScorePiles = createScorePiles(
    getName as (name: CardHandsAndPlayerRoles) => PlayerNames
  );

  const getRole = (name: PlayerAliases): PlayerRole => {
    if (["oya", "ko"].includes(name)) {
      return name as PlayerRole;
    } else if (
      ([_oya, _ko] as Array<PlayerNames>).includes(name as PlayerNames)
    ) {
      return [_oya, _ko].findIndex((t) => t == name) == 0 ? "oya" : "ko";
    }
    return getRole(getCurrentPlayer());
  };

  let turnCounter = createTurnCounter(getRole);

  const getNameFromRole = (role: string) => (role == "oya" ? _oya : _ko);

  const getCurrentPlayer = () =>
    getNameFromRole(turnCounter.currentPlayer) as PlayerNames;

  const restart = () => {
    _oya = "playingField";
    _ko = "playingField";
    cardHands = createCardHands(getName);
    scorePiles = createScorePiles(
      getName as (name: CardHandsAndPlayerRoles) => PlayerNames
    );
    turnCounter = createTurnCounter(getRole);
    _cardToMatch = null;
    _cardToPlay = null;
    drawPile.shuffle();
  };

  // Game logic

  const handToScorePile = (
    origin: PlayerNames | "playingField",
    destination: PlayerNames,
    cards: CardSet
  ) => scorePiles.add(destination, cardHands.remove(origin, cards));

  type CardHandKeys = "playerOne" | "playerTwo" | "playingField";

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

    turnCounter.nextPhase("chooseOya");

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

  const setup = ({ forceFirstLuckyHand = false } = {}): Array<SetupRound> => {
    if (turnCounter.currentPhase != "setup") return [];
    if (testMode && forceFirstLuckyHand) {
      drawPile.luckyHandShuffle();
    } else {
      drawPile.shuffle();
    }
    cardHands.reset();
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
          playerOne: [...cardHands[_oya == "playerOne" ? _oya : _ko]],
          playerTwo: [...cardHands[_oya == "playerTwo" ? _oya : _ko]],
          deckCount: drawPile.count(),
          playingField: [...cardHands["playingField"]],
        },
      ];
      const temp = Object.values(countMonths(cardHands[currentPlayer]));
      if (
        temp.includes(4) ||
        temp.reduce(
          (occurrences, current) =>
            current == 2 ? occurrences + 1 : occurrences,
          0
        ) == 4
      ) {
        drawPile.shuffle();
        cardHands.reset();
        x = -1;
      }
    }

    turnCounter.nextPhase("setup");

    return result;
  };

  const countMonths = (current: CardSet): { [index: number]: number } => {
    let monthCounts: { [index: number]: number } = {};
    current.forEach(
      ({ month }: { month: number }) =>
        (monthCounts = {
          ...monthCounts,
          [month]: (monthCounts[month] ?? 0) + 1,
        })
    );

    return monthCounts;
  };

  const play = (selectedCard: Card | null): CardSet => {
    if (!turnCounter.currentPhase.match(/play/)) {
      return [];
    }

    if (_cardToMatch && selectedCard) {
      const result = matchCard(selectedCard);
      checkIfScoreImproved();
      return result;
    }

    const currentCard = _cardToPlay ?? selectedCard;
    if (currentCard === null || currentCard === undefined) {
      return [];
    }

    if (_cardToPlay !== null) {
      cardHands.add("current", _cardToPlay);
      _cardToPlay = null;
    }

    const temp = playCard(currentCard) ?? [];
    _cardToMatch === null
      ? turnCounter.nextPhase(turnCounter.currentPhase)
      : null;
    checkIfScoreImproved();
    return temp;
  };

  const matchCard = (selectedCard: Card): CardSet => {
    if (
      _cardToMatch == null ||
      selectedCard["month"] != _cardToMatch["month"] ||
      !cardHands.exists("playingField", selectedCard)
    )
      return [];

    handToScorePile("playingField", getCurrentPlayer(), [selectedCard]);
    scorePiles.add("current", { ..._cardToMatch });
    const temp = [{ ...selectedCard }, { ..._cardToMatch }];
    _cardToMatch = null;
    turnCounter.nextPhase(turnCounter.currentPhase);
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
    const matches: CardSet = cardHands.getFieldMatches(selectedCard);

    if (matches.length == 1 || matches.length == 3) {
      handToScorePile("playingField", getCurrentPlayer(), matches);
      handToScorePile(getCurrentPlayer(), getCurrentPlayer(), [selectedCard]);
    } else if (matches.length == 0) {
      cardHands.add(
        "playingField",
        cardHands.remove(getCurrentPlayer(), selectedCard) as Card
      );
    } else {
      _cardToMatch = cardHands.remove(getCurrentPlayer(), selectedCard) as Card;
    }

    return [selectedCard, ...duplicateCardSet(matches)];
  };

  const shoubu = (): boolean => {
    checkIfScoreImproved();
    if (
      turnCounter.permittedToEndRound &&
      turnCounter.currentPhase.match(/round call/)
    ) {
      scorePiles.scorePoints("current");
      scorePiles.resetScoreModifiers();
      checkIfRoundLimitReached();
      [_oya, _ko] = [getName("current"), getName("opponent")];
      turnCounter.endRound();

      return true;
    }

    return false;
  };

  const koiKoi = () => {
    if (
      turnCounter.permittedToEndRound &&
      turnCounter.currentPhase.match(/round call/)
    ) {
      scorePiles.addScoreModifier("current", 2);
      checkForNoCards();
      turnCounter.nextTurn();
    }
  };

  const checkIfScoreImproved = () => {
    if (scorePiles.calculateTempScore().isImproved) {
      turnCounter.permitToEndRound(true);
    }
  };

  const checkForNoCards = () => {
    if (
      !cardHands.doPlayersHaveCards &&
      turnCounter.currentPhase.match(/round call/)
    ) {
      checkIfRoundLimitReached();
      scorePiles.resetScoreModifiers();
      turnCounter.endRound(true);
    }
  };

  const checkIfRoundLimitReached = () => {
    if (turnCounter.currentRound == roundLimit) {
      turnCounter.endGame();
      winner = scorePiles.chooseWinner();
    }
  };

  return {
    chooseOya,
    setup,
    hasChoosenOya: () => _oya != "playingField",
    play,
    draw,
    shoubu,
    restart,
    koiKoi,
    get scoreModifiers() {
      return {
        playerOne: scorePiles.scores.playerOne.modifier,
        playerTwo: scorePiles.scores.playerTwo.modifier,
      };
    },
    get forcePermitToEndRound() {
      return testMode ? turnCounter.permitToEndRound(true) : () => {};
    },
    get nextTurn() {
      checkIfScoreImproved();
      if (
        turnCounter.currentPhase.match(/round call/) &&
        cardHands.doPlayersHaveCards
      ) {
        scorePiles.resetTempScore();
        checkForNoCards();
        return turnCounter.nextTurn;
      }

      checkForNoCards();
      return () => {};
    },
    get round() {
      return turnCounter.currentRound;
    },
    get phase() {
      return turnCounter.currentPhase;
    },
    get scores() {
      return scorePiles.playerScores;
    },
    get oya() {
      return _oya as PlayerNames;
    },
    get ko() {
      return _ko as PlayerNames;
    },
    get cardToMatch() {
      return _cardToMatch !== null ? { ..._cardToMatch } : null;
    },
    get cardToPlay() {
      return _cardToPlay !== null ? { ..._cardToPlay } : null;
    },
    get forceScorePile() {
      return testMode
        ? scorePiles.replace
        : (s: PlayerNames) => [...scorePiles[s]];
    },
    get getPotentialScore() {
      return scorePiles.getTotal;
    },
    get forceTurn() {
      return testMode ? turnCounter.forcePlayerTurn : () => {};
    },
    get setCardHand() {
      return testMode ? cardHands.replace : () => {};
    },
    get getScorePile() {
      return scorePiles.get;
    },
    get getHand() {
      return cardHands.duplicate;
    },
    get matches() {
      return (c: Card | null): CardSet =>
        testMode ? cardHands.getFieldMatches(c) : [];
    },
    get winner() {
      return winner;
    },
    get currentPlayer() {
      return getCurrentPlayer();
    },
    get players() {
      return {
        playerOne: getRole("playerOne"),
        playerTwo: getRole("playerTwo"),
      };
    },
    get deckCount() {
      return drawPile.count();
    },
    get endRoundOptions() {
      checkIfScoreImproved();
      const val =
        turnCounter.currentPhase.includes("round call") &&
        turnCounter.permittedToEndRound;

      return {
        koiKoi: val,
        shoubu: val,
        endRound: turnCounter.currentPhase.includes("round call") && !val,
      };
    },
    get getYakuWithCards() {
      return scorePiles.getYakuWithCards;
    },
    get roundLimit() {
      return roundLimit;
    },
  };
};

export default game;
