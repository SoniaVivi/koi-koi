import { duplicateCardSet } from "./deck";
import {
  Card,
  CardHandsAndPlayerRoles,
  CardSet,
  PlayerAliases,
  PlayerNames,
  Score,
  ScorePiles,
} from "./gameTypes";
import { getYakuCardIndices, identifyYaku } from "./yakuMatcher";

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
        yaku: [] as Array<[string, number]>,
        modifier: 1.0,
        tempScore: 0,
      },
      playerTwo: {
        total: 0,
        scored: [] as CardSet,
        yaku: [] as Array<[string, number]>,
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
    getYakuWithCards: (target: PlayerAliases) =>
      generateYakuList(target, true) as {
        score: number;
        yaku: Array<[string, number, CardSet]>;
      },
    getTotal: (target: PlayerAliases) =>
      generateYakuList(target, false) as Score,
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
      if (scorePiles.scores[getName("opponent")].modifier > 1.0)
        scorePiles.addScoreModifier(target, 2);
      dump(target == "playerOne" ? "playerTwo" : "playerOne");
      const total = scorePiles.getTotal(target);

      if (total.score >= 7) scorePiles.addScoreModifier(target, 2);

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

  function generateYakuList(
    name: PlayerAliases,
    includeCards = false
  ): { score: number; yaku: Array<[string, number, CardSet]> } | Score {
    const target = getName(name) as PlayerNames;
    const getYaku = (cards: CardSet) => identifyYaku(cards);
    let result: Score = { score: 0, yaku: [] };
    let cards: CardSet = scorePiles.get(target);
    let potentialYaku = getYaku(cards);

    while (potentialYaku.length != 0) {
      potentialYaku = potentialYaku.sort((a, b) => b[1] - a[1]);
      const current = potentialYaku.splice(0, 1)[0];
      if (includeCards) {
        // If include cards is true, it will return with 3 elems
        //@ts-ignore
        current.push([] as CardSet);
      }

      result = {
        score: result["score"] + current[1],
        yaku: result["yaku"].concat([current]),
      };

      const temp = getYakuCardIndices(current[0], cards) as Array<number>;
      cards = cards.filter((card, i) => {
        if (!temp.includes(i as number)) return true;
        if (includeCards) {
          // Empty array is present
          //@ts-ignore
          result.yaku[result.yaku.length - 1][2].push(card);
        }
      });
      potentialYaku = getYaku(cards);
    }

    return result;
  }

  const dump = (target: PlayerAliases): CardSet => {
    const removed = duplicateCardSet(scorePiles[getName(target)]);
    scorePiles.replace(target, []);
    return removed;
  };

  return scorePiles;
};

export default createScorePiles;
