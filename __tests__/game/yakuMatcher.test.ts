import {
  identifyYaku as matchYaku,
  getYakuCardIndices,
} from "../../game/yakuMatcher";

describe("matchYaku()", () => {
  it("returns [] for no cards", () => {
    expect(matchYaku([])).toEqual([]);
  });

  it("returns n - 9 if n >= 10 kasu cards", () => {
    expect(
      matchYaku([
        { month: 1, name: "kasu" },
        { month: 1, name: "kasu" },
        { month: 2, name: "kasu" },
        { month: 2, name: "kasu" },
        { month: 3, name: "kasu" },
        { month: 3, name: "kasu" },
        { month: 4, name: "kasu" },
        { month: 4, name: "kasu" },
        { month: 5, name: "kasu" },
        { month: 5, name: "kasu" },
      ])
    ).toEqual([["kasu", 1]]);

    expect(
      matchYaku([
        { month: 1, name: "kasu" },
        { month: 1, name: "kasu" },
        { month: 2, name: "kasu" },
        { month: 2, name: "kasu" },
        { month: 3, name: "kasu" },
        { month: 3, name: "kasu" },
        { month: 4, name: "kasu" },
        { month: 4, name: "kasu" },
        { month: 5, name: "kasu" },
        { month: 5, name: "kasu" },
        { month: 11, name: "kasu" },
        { month: 12, name: "kasu" },
        { month: 12, name: "kasu" },
        { month: 12, name: "kasu" },
      ])
    ).toEqual([["kasu", 5]]);
  });

  it("matches Five, Four, Rainy Four, and Three Hikari", () => {
    expect(
      matchYaku([
        { month: 1, name: "hikari" },
        { month: 3, name: "hikari" },
        { month: 8, name: "hikari" },
        { month: 11, name: "hikari" },
        { month: 12, name: "hikari" },
      ])
    ).toEqual([
      ["fiveHikari", 15],
      ["fourHikari", 8],
      ["rainyFourHikari", 7],
      ["threeHikari", 6],
    ]);
  });

  it("matches Four Hikari", () => {
    expect(
      matchYaku([
        { month: 1, name: "hikari" },
        { month: 3, name: "hikari" },
        { month: 8, name: "hikari" },
        { month: 12, name: "hikari" },
      ])
    ).toEqual([
      ["fourHikari", 8],
      ["threeHikari", 6],
    ]);
  });

  it("matches Rainy Four Hikari", () => {
    expect(
      matchYaku([
        { month: 1, name: "hikari" },
        { month: 3, name: "hikari" },
        { month: 8, name: "hikari" },
        { month: 11, name: "hikari" },
      ])
    ).toEqual([
      ["rainyFourHikari", 7],
      ["threeHikari", 6],
    ]);

    expect(
      matchYaku([
        { month: 1, name: "hikari" },
        { month: 3, name: "hikari" },
        { month: 11, name: "hikari" },
        { month: 12, name: "hikari" },
      ])
    ).toEqual([
      ["rainyFourHikari", 7],
      ["threeHikari", 6],
    ]);
  });

  it("matches Three Hikari", () => {
    expect(
      matchYaku([
        { month: 1, name: "hikari" },
        { month: 3, name: "hikari" },
        { month: 8, name: "hikari" },
      ])
    ).toEqual([["threeHikari", 6]]);

    expect(
      matchYaku([
        { month: 3, name: "hikari" },
        { month: 8, name: "hikari" },
        { month: 12, name: "hikari" },
      ])
    ).toEqual([["threeHikari", 6]]);

    expect(
      matchYaku([
        { month: 3, name: "hikari" },
        { month: 8, name: "hikari" },
        { month: 11, name: "hikari" },
      ])
    ).toEqual([]);
  });

  it("matches Moon Viewing", () => {
    expect(
      matchYaku([
        { month: 8, name: "hikari" },
        { month: 9, name: "tane" },
      ])
    ).toEqual([["moonViewing", 5]]);
  });

  it("matches Cherry Blossom Viewing", () => {
    expect(
      matchYaku([
        { month: 3, name: "hikari" },
        { month: 9, name: "tane" },
      ])
    ).toEqual([["cherryBlossomViewing", 5]]);
  });

  it("matches Boar, Deer, Butterflies", () => {
    expect(
      matchYaku([
        { month: 6, name: "tane" },
        { month: 7, name: "tane" },
        { month: 10, name: "tane" },
      ])
    ).toEqual([["boarDeerButterflies", 5]]);
  });

  it("matches Tane", () => {
    expect(
      matchYaku([
        { month: 2, name: "tane" },
        { month: 7, name: "tane" },
        { month: 10, name: "tane" },
      ])
    ).toEqual([]);

    expect(
      matchYaku([
        { month: 2, name: "tane" },
        { month: 4, name: "tane" },
        { month: 5, name: "tane" },
        { month: 6, name: "tane" },
        { month: 7, name: "tane" },
      ])
    ).toEqual([["tane", 1]]);

    expect(
      matchYaku([
        { month: 2, name: "tane" },
        { month: 4, name: "tane" },
        { month: 5, name: "tane" },
        { month: 6, name: "tane" },
        { month: 7, name: "tane" },
        { month: 8, name: "tane" },
        { month: 9, name: "tane" },
        { month: 10, name: "tane" },
        { month: 11, name: "tane" },
      ]).sort()
    ).toEqual(
      [
        ["tane", 5],
        ["boarDeerButterflies", 5],
      ].sort()
    );
  });

  it("matches Red Poetry Tanzaku", () => {
    expect(
      matchYaku([
        { month: 1, name: "tanzaku" },
        { month: 2, name: "tanzaku" },
        { month: 3, name: "tanzaku" },
      ])
    ).toEqual([["redPoetryTanzaku", 5]]);
  });

  it("matches Blue Tanzaku", () => {
    expect(
      matchYaku([
        { month: 6, name: "tanzaku" },
        { month: 9, name: "tanzaku" },
        { month: 10, name: "tanzaku" },
      ])
    ).toEqual([["blueTanzaku", 5]]);
  });

  it("matches Combined Red Poetry and Blue Tanzaku", () => {
    expect(
      matchYaku([
        { month: 1, name: "tanzaku" },
        { month: 2, name: "tanzaku" },
        { month: 3, name: "tanzaku" },
        { month: 6, name: "tanzaku" },
        { month: 9, name: "tanzaku" },
        { month: 10, name: "tanzaku" },
      ]).sort()
    ).toEqual(
      [
        ["blueTanzaku", 5],
        ["redPoetryTanzaku", 5],
        ["combinedRedPoetryAndBlueTanzaku", 10],
        ["tanzaku", 2],
      ].sort()
    );
  });

  it("matches Tanzaku", () => {
    expect(
      matchYaku([
        { month: 1, name: "tanzaku" },
        { month: 2, name: "tanzaku" },
        { month: 6, name: "tanzaku" },
        { month: 9, name: "tanzaku" },
      ])
    ).toEqual([]);

    expect(
      matchYaku([
        { month: 1, name: "tanzaku" },
        { month: 2, name: "tanzaku" },
        { month: 6, name: "tanzaku" },
        { month: 9, name: "tanzaku" },
        { month: 11, name: "tanzaku" },
      ])
    ).toEqual([["tanzaku", 1]]);

    expect(
      matchYaku([
        { month: 1, name: "tanzaku" },
        { month: 2, name: "tanzaku" },
        { month: 3, name: "tanzaku" },
        { month: 4, name: "tanzaku" },
        { month: 5, name: "tanzaku" },
        { month: 6, name: "tanzaku" },
        { month: 7, name: "tanzaku" },
        { month: 9, name: "tanzaku" },
        { month: 10, name: "tanzaku" },
        { month: 11, name: "tanzaku" },
      ]).sort()
    ).toEqual(
      [
        ["tanzaku", 6],
        ["blueTanzaku", 5],
        ["redPoetryTanzaku", 5],
        ["combinedRedPoetryAndBlueTanzaku", 10],
      ].sort()
    );
  });

  it("matches Monthly Cards", () => {
    expect(
      matchYaku([
        { month: 1, name: "hikari" },
        { month: 1, name: "tanzaku" },
        { month: 1, name: "kasu" },
        { month: 1, name: "kasu" },
      ])
    ).toEqual([["monthlyCards", 4]]);

    expect(
      matchYaku([
        { month: 2, name: "tane" },
        { month: 2, name: "tanzaku" },
        { month: 2, name: "kasu" },
        { month: 2, name: "kasu" },
      ])
    ).toEqual([["monthlyCards", 4]]);

    expect(
      matchYaku([
        { month: 3, name: "hikari" },
        { month: 3, name: "tanzaku" },
        { month: 3, name: "kasu" },
        { month: 3, name: "kasu" },
      ])
    ).toEqual([["monthlyCards", 4]]);

    expect(
      matchYaku([
        { month: 12, name: "hikari" },
        { month: 12, name: "kasu" },
        { month: 12, name: "kasu" },
        { month: 12, name: "kasu" },
      ])
    ).toEqual([["monthlyCards", 4]]);
  });
});

describe("getYakuCardIndices", () => {
  test("Five Hikari", () =>
    expect(
      getYakuCardIndices("fiveHikari", [
        { month: 1, name: "hikari" },
        { month: 1, name: "kasu" },
        { month: 3, name: "hikari" },
        { month: 8, name: "hikari" },
        { month: 1, name: "kasu" },
        { month: 11, name: "hikari" },
        { month: 12, name: "hikari" },
      ])
    ).toEqual([0, 2, 3, 5, 6]));

  test("Four Hikari", () =>
    expect(
      getYakuCardIndices("fourHikari", [
        { month: 1, name: "kasu" },
        { month: 1, name: "hikari" },
        { month: 3, name: "hikari" },
        { month: 1, name: "kasu" },
        { month: 8, name: "hikari" },
        { month: 12, name: "hikari" },
      ])
    ).toEqual([1, 2, 4, 5]));

  test("Rainy Four Hikari", () =>
    expect(
      getYakuCardIndices("rainyFourHikari", [
        { month: 1, name: "hikari" },
        { month: 3, name: "hikari" },
        { month: 1, name: "kasu" },
        { month: 8, name: "hikari" },
        { month: 11, name: "hikari" },
        { month: 1, name: "kasu" },
      ]).sort()
    ).toEqual([0, 1, 3, 4]));

  test("threeHikari", () =>
    expect(
      getYakuCardIndices("threeHikari", [
        { month: 1, name: "kasu" },
        { month: 3, name: "hikari" },
        { month: 8, name: "hikari" },
        { month: 1, name: "kasu" },
        { month: 12, name: "hikari" },
      ])
    ).toEqual([1, 2, 4]));

  test("moonViewing", () =>
    expect(
      getYakuCardIndices("moonViewing", [
        { month: 2, name: "kasu" },
        { month: 8, name: "hikari" },
        { month: 2, name: "kasu" },
        { month: 9, name: "tane" },
      ])
    ).toEqual([1, 3]));

  test("cherryBlossomViewing", () =>
    expect(
      getYakuCardIndices("cherryBlossomViewing", [
        { month: 9, name: "tane" },
        { month: 2, name: "kasu" },
        { month: 3, name: "hikari" },
        { month: 8, name: "hikari" },
        { month: 2, name: "kasu" },
      ]).sort()
    ).toEqual([0, 2]));

  test("boarDeerButterflies", () =>
    expect(
      getYakuCardIndices("boarDeerButterflies", [
        { month: 2, name: "kasu" },
        { month: 3, name: "hikari" },
        { month: 6, name: "tane" },
        { month: 7, name: "tane" },
        { month: 10, name: "tane" },
      ])
    ).toEqual([2, 3, 4]));

  test("tane", () => {
    expect(
      getYakuCardIndices("tane", [
        { month: 2, name: "kasu" },
        { month: 2, name: "tane" },
        { month: 4, name: "tane" },
        { month: 2, name: "kasu" },
        { month: 5, name: "tane" },
        { month: 6, name: "tane" },
        { month: 12, name: "hikari" },
        { month: 7, name: "tane" },
      ])
    ).toEqual([1, 2, 4, 5, 7]);

    expect(
      getYakuCardIndices("tane", [
        { month: 2, name: "kasu" },
        { month: 2, name: "tane" },
        { month: 4, name: "tane" },
        { month: 2, name: "kasu" },
        { month: 5, name: "tane" },
        { month: 6, name: "tane" },
        { month: 12, name: "hikari" },
        { month: 7, name: "tane" },
        { month: 8, name: "tane" },
        { month: 9, name: "tane" },
        { month: 10, name: "tane" },
        { month: 11, name: "tane" },
      ])
    ).toEqual([1, 2, 4, 5, 7, 8, 9, 10, 11]);
  });

  test("redPoetryTanzaku", () =>
    expect(
      getYakuCardIndices("redPoetryTanzaku", [
        { month: 1, name: "tanzaku" },
        { month: 2, name: "kasu" },
        { month: 3, name: "hikari" },
        { month: 2, name: "tanzaku" },
        { month: 2, name: "kasu" },
        { month: 12, name: "hikari" },
        { month: 3, name: "tanzaku" },
      ])
    ).toEqual([0, 3, 6]));

  test("blueTanzaku", () =>
    expect(
      getYakuCardIndices("blueTanzaku", [
        { month: 2, name: "kasu" },
        { month: 6, name: "tanzaku" },
        { month: 9, name: "tanzaku" },
        { month: 10, name: "tanzaku" },
        { month: 3, name: "hikari" },
        { month: 8, name: "hikari" },
        { month: 2, name: "kasu" },
        { month: 12, name: "hikari" },
      ])
    ).toEqual([1, 2, 3]));

  test("combinedRedPoetryAndBlueTanzaku", () =>
    expect(
      getYakuCardIndices("combinedRedPoetryAndBlueTanzaku", [
        { month: 2, name: "kasu" },
        { month: 1, name: "tanzaku" },
        { month: 2, name: "tanzaku" },
        { month: 3, name: "tanzaku" },
        { month: 6, name: "tanzaku" },
        { month: 12, name: "hikari" },
        { month: 9, name: "tanzaku" },
        { month: 10, name: "tanzaku" },
        { month: 2, name: "kasu" },
      ])
    ).toEqual([1, 2, 3, 4, 6, 7]));

  test("tanzaku", () =>
    expect(
      getYakuCardIndices("tanzaku", [
        { month: 5, name: "tanzaku" },
        { month: 6, name: "tanzaku" },
        { month: 7, name: "tanzaku" },
        { month: 2, name: "kasu" },
        { month: 3, name: "hikari" },
        { month: 8, name: "hikari" },
        { month: 2, name: "kasu" },
        { month: 1, name: "tanzaku" },
        { month: 2, name: "tanzaku" },
        { month: 3, name: "tanzaku" },
        { month: 4, name: "tanzaku" },
        { month: 9, name: "tanzaku" },
        { month: 12, name: "hikari" },
        { month: 10, name: "tanzaku" },
        { month: 11, name: "tanzaku" },
      ])
    ).toEqual([0, 1, 2, 7, 8, 9, 10, 11, 13, 14]));

  test("monthlyCards", () => {
    expect(
      getYakuCardIndices("monthlyCards", [
        { month: 3, name: "kasu" },
        { month: 2, name: "kasu" },
        { month: 6, name: "tanzaku" },
        { month: 3, name: "hikari" },
        { month: 3, name: "kasu" },
        { month: 9, name: "tanzaku" },
        { month: 10, name: "tanzaku" },
        { month: 8, name: "hikari" },
        { month: 3, name: "tanzaku" },
        { month: 2, name: "kasu" },
        { month: 12, name: "hikari" },
      ])
    ).toEqual([0, 3, 4, 8]);

    expect(
      getYakuCardIndices("monthlyCards", [
        { month: 3, name: "kasu" },
        { month: 2, name: "kasu" },
        { month: 6, name: "tanzaku" },
        { month: 3, name: "hikari" },
        { month: 3, name: "kasu" },
        { month: 9, name: "tanzaku" },
        { month: 10, name: "tanzaku" },
        { month: 8, name: "hikari" },
        { month: 3, name: "tanzaku" },
        { month: 2, name: "kasu" },
        { month: 12, name: "hikari" },
        { month: 12, name: "kasu" },
        { month: 12, name: "kasu" },
        { month: 12, name: "kasu" },
      ])
    ).toEqual([0, 3, 4, 8]);
  });

  test("kasu", () => {
    expect(
      getYakuCardIndices("kasu", [
        { month: 3, name: "kasu" },
        { month: 2, name: "kasu" },
        { month: 3, name: "hikari" },
        { month: 4, name: "kasu" },
        { month: 4, name: "kasu" },
        { month: 3, name: "kasu" },
        { month: 9, name: "tanzaku" },
        { month: 5, name: "kasu" },
        { month: 5, name: "kasu" },
        { month: 10, name: "tanzaku" },
        { month: 2, name: "kasu" },
        { month: 12, name: "kasu" },
        { month: 12, name: "kasu" },
        { month: 12, name: "kasu" },
      ]).sort()
    ).toEqual([0, 1, 3, 4, 5, 7, 8, 10, 11, 12, 13].sort());
  });
});
