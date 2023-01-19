import { Card, CardSet, duplicateCardSet } from "./deck";
import {
  CardHandsAndPlayerRoles,
  PlayerAliases,
  PlayerCardSets,
  PlayerNames,
} from "./game";
import { getYakuCardIndices, identifyYaku } from "./yakuMatcher";

export type Score = { score: number; yaku: Array<string> };

export type ScorePiles = PlayerCardSets & {
  scores: {
    playerOne: {
      total: number;
      scored: CardSet;
      yaku: string[];
      modifier: number;
      tempScore: number;
    };
    playerTwo: {
      total: number;
      scored: CardSet;
      yaku: string[];
      modifier: number;
      tempScore: number;
    };
  };
  get: (name: PlayerAliases) => CardSet;
  replace: (name: PlayerAliases, replacementHand: CardSet) => CardSet;
  getTotal: (target: PlayerAliases) => Score;
  add: (name: PlayerAliases, cards: Card | Array<Card>) => CardSet;
  scorePoints: (name: PlayerAliases) => void;
  addScoreModifier: (player: PlayerAliases, modifier: number) => void;
  resetScoreModifiers: () => void;
  calculateTempScore: () => { score: number; isImproved: boolean };
  resetTempScore: () => void;
  chooseWinner: () => PlayerNames | "tie";
  get playerScores(): { playerOne: number; playerTwo: number };
};

const createScorePiles = (
  getName: (name: CardHandsAndPlayerRoles) => PlayerNames
): ScorePiles => {
  const scorePiles = {
    playerOne: [] as CardSet,
    playerTwo: [] as CardSet,
    scores: {
      playerOne: {
        total: 0,
        scored: [] as CardSet,
        yaku: [] as string[],
        modifier: 1.0,
        tempScore: 0,
      },
      playerTwo: {
        total: 0,
        scored: [] as CardSet,
        yaku: [] as string[],
        modifier: 1.0,
        tempScore: 0,
      },
    },
    get: (name: PlayerAliases): CardSet =>
      scorePiles[getName(name) as PlayerNames],
    replace: (name: PlayerAliases, replacementHand: CardSet): CardSet => {
      name = getName(name) as PlayerNames;
      scorePiles[name] = [...replacementHand];

      return duplicateCardSet(scorePiles[name]);
    },
    getTotal: (name: PlayerAliases): Score => {
      const target = getName(name) as PlayerNames;
      const getYaku = (cards: CardSet) => identifyYaku(cards);
      let result: Score = { score: 0, yaku: [] };
      let cards: CardSet = scorePiles.get(target);
      let potentialYaku = getYaku(cards);

      while (potentialYaku.length != 0) {
        potentialYaku = potentialYaku.sort((a, b) => b[1] - a[1]);
        const current = potentialYaku.splice(0, 1)[0];
        result = {
          score: result["score"] + current[1],
          yaku: [...result["yaku"], current[0]],
        };

        const temp = getYakuCardIndices(current[0], cards) as Array<number>;
        cards = cards.filter((_, i) => !temp.includes(i as number));
        potentialYaku = getYaku(cards);
      }

      return result;
    },
    add: (name: PlayerAliases, cards: Card | CardSet): CardSet => {
      if (cards.constructor !== Array) {
        cards = [cards] as CardSet;
      }
      const target = getName(name) as PlayerNames;
      scorePiles[target] = [...scorePiles[target], ...cards] as CardSet;
      return scorePiles[target];
    },
    scorePoints: (name: PlayerAliases): void => {
      const target = getName(name);
      dump(target == "playerOne" ? "playerTwo" : "playerOne");
      const total = scorePiles.getTotal(target);
      scorePiles.scores[target].total +=
        total.score * scorePiles.scores[target].modifier;
      scorePiles.scores[target].yaku = [
        ...scorePiles.scores[target].yaku,
        ...total.yaku,
      ];
      scorePiles.scores[target].scored = [
        ...scorePiles.scores[target].scored,
        ...dump(target),
      ];
      scorePiles.resetScoreModifiers();
    },
    addScoreModifier: (player: PlayerAliases, modifier: number) => {
      const target = getName(player);
      scorePiles.scores[target].modifier *= modifier;
    },
    resetScoreModifiers: () => {
      scorePiles.scores.playerOne.modifier = 1.0;
      scorePiles.scores.playerTwo.modifier = 1.0;
    },
    calculateTempScore() {
      const prevScore = scorePiles.scores[getName("current")].tempScore;
      const newScore =
        scorePiles.getTotal("current").score -
        scorePiles.scores[getName("current")].total;
      scorePiles.scores[getName("current")].tempScore = newScore;

      return { score: newScore, isImproved: newScore > prevScore };
    },
    resetTempScore() {
      scorePiles.scores.playerOne.tempScore = 0;
      scorePiles.scores.playerTwo.tempScore = 0;
    },
    chooseWinner: (): PlayerNames | "tie" => {
      return (["playerOne", "playerTwo"] as Array<PlayerNames>).sort(
        (a, b) => scorePiles.scores[a].total - scorePiles.scores[b].total
      )[0];
    },
    get playerScores() {
      return {
        playerOne: scorePiles.scores.playerOne.total,
        playerTwo: scorePiles.scores.playerTwo.total,
      };
    },
  };

  const dump = (target: PlayerAliases): CardSet => {
    const removed = duplicateCardSet(scorePiles[getName(target)]);
    scorePiles.replace(target, []);
    return removed;
  };

  return scorePiles;
};

export default createScorePiles;
