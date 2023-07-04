import { CardSet } from "../../../game/gameTypes";

const yakuList: {
  [index: string]: { cards: CardSet; description: string; points: number };
} = {
  fiveHikari: {
    cards: [
      { month: 1, name: "hikari" },
      { month: 3, name: "hikari" },
      { month: 8, name: "hikari" },
      { month: 11, name: "hikari" },
      { month: 12, name: "hikari" },
    ],
    points: 15,
    description: "All five hikari cards",
  },
  fourHikari: {
    cards: [
      { month: 1, name: "hikari" },
      { month: 3, name: "hikari" },
      { month: 8, name: "hikari" },
      { month: 12, name: "hikari" },
    ],
    points: 8,
    description:
      "All hikari cards EXCEPT Ono no Michikaze (November Hikari Card)",
  },
  rainyFourHikari: {
    cards: [
      { month: 11, name: "hikari" },
      { month: 1, name: "hikari" },
      { month: 3, name: "hikari" },
      { month: 8, name: "hikari" },
    ],
    points: 7,
    description:
      "Any four hikari cards INCLUDING Ono no Michikaze (November Hikari Card)",
  },
  threeHikari: {
    cards: [
      { month: 1, name: "hikari" },
      { month: 8, name: "hikari" },
      { month: 12, name: "hikari" },
    ],
    points: 6,
    description:
      "Any three hikari cards EXCEPT Ono no Michikaze (November Hikari Card)",
  },
  moonViewing: {
    cards: [
      { month: 8, name: "hikari" },
      { month: 9, name: "tane" },
    ],
    points: 5,
    description: "Moon and Sake (August Hikari and September Tane)",
  },
  cherryBlossomViewing: {
    cards: [
      { month: 3, name: "hikari" },
      { month: 9, name: "tane" },
    ],
    points: 5,
    description: "Curtain and Sake (March Hikari and September Tane)",
  },
  boarDeerButterflies: {
    cards: [
      { month: 6, name: "tane" },
      { month: 7, name: "tane" },
      { month: 10, name: "tane" },
    ],
    points: 5,
    description:
      "June, July, and October Tane (Boar, Deer, and Butterflies cards)",
  },
  redPoetryTanzaku: {
    cards: [
      { month: 1, name: "tanzaku" },
      { month: 2, name: "tanzaku" },
      { month: 3, name: "tanzaku" },
    ],
    points: 5,
    description: "All 3 Red Poetry Tanzaku Cards",
  },
  blueTanzaku: {
    cards: [
      { month: 6, name: "tanzaku" },
      { month: 9, name: "tanzaku" },
      { month: 10, name: "tanzaku" },
    ],
    points: 5,
    description: "All 3 Blue Tanzaku Cards",
  },
  combinedRedPoetryAndBlueTanzaku: {
    cards: [
      { month: 1, name: "tanzaku" },
      { month: 2, name: "tanzaku" },
      { month: 3, name: "tanzaku" },
      { month: 6, name: "tanzaku" },
      { month: 9, name: "tanzaku" },
      { month: 10, name: "tanzaku" },
    ],
    points: 10,
    description: "All Red Poetry tanzaku and blue tanzaku cards",
  },
  tane: {
    cards: [
      { month: 2, name: "tane" },
      { month: 4, name: "tane" },
      { month: 5, name: "tane" },
      { month: 6, name: "tane" },
      { month: 7, name: "tane" },
      { month: 8, name: "tane" },
      { month: 9, name: "tane" },
      { month: 10, name: "tane" },
      { month: 11, name: "tane" },
    ],
    points: 1,
    description:
      "Any 5 tane card. An additional point is rewarded for each additional tane card",
  },
  kasu: {
    cards: [
      { month: 1, name: "kasu" },
      { month: 2, name: "kasu" },
      { month: 3, name: "kasu" },
      { month: 4, name: "kasu" },
      { month: 5, name: "kasu" },
      { month: 6, name: "kasu" },
      { month: 7, name: "kasu" },
      { month: 8, name: "kasu" },
      { month: 9, name: "kasu" },
      { month: 10, name: "kasu" },
      { month: 11, name: "kasu" },
      { month: 12, name: "kasu" },
    ],
    points: 1,
    description:
      "Any 10 kasu cards. An additional point is rewarded for each additional kasu card",
  },
  tanzaku: {
    cards: [
      { month: 1, name: "tanzaku" },
      { month: 2, name: "tanzaku" },
      { month: 3, name: "tanzaku" },
      { month: 5, name: "tanzaku" },
      { month: 6, name: "tanzaku" },
      { month: 7, name: "tanzaku" },
      { month: 9, name: "tanzaku" },
      { month: 10, name: "tanzaku" },
      { month: 11, name: "tanzaku" },
    ],
    points: 1,
    description:
      "Any 5 tanzaku cards. An additional point is rewarded for each additional Tanzaku card ",
  },
  monthlyCards: {
    cards: [
      { month: 11, name: "hikari" },
      { month: 11, name: "tane" },
      { month: 11, name: "kasu" },
      { month: 11, name: "tanzaku" },
    ],
    points: 4,
    description: "All cards belonging to the same month",
  },
};

export default yakuList;
