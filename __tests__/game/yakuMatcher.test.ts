import yakuMatcher from "../../game/yakuMatcher";

describe("yakuMatcher", () => {
  it("returns [] for no cards", () => {
    expect(yakuMatcher.match([])).toEqual([]);
  });

  it("returns n - 9 if n >= 10 kasu cards", () => {
    expect(
      yakuMatcher.match([
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
      yakuMatcher.match([
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
      yakuMatcher.match([
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
      yakuMatcher.match([
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
      yakuMatcher.match([
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
      yakuMatcher.match([
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
      yakuMatcher.match([
        { month: 1, name: "hikari" },
        { month: 3, name: "hikari" },
        { month: 8, name: "hikari" },
      ])
    ).toEqual([["threeHikari", 6]]);

    expect(
      yakuMatcher.match([
        { month: 3, name: "hikari" },
        { month: 8, name: "hikari" },
        { month: 12, name: "hikari" },
      ])
    ).toEqual([["threeHikari", 6]]);

    expect(
      yakuMatcher.match([
        { month: 3, name: "hikari" },
        { month: 8, name: "hikari" },
        { month: 11, name: "hikari" },
      ])
    ).toEqual([]);
  });

  it("matches Moon Viewing", () => {
    expect(
      yakuMatcher.match([
        { month: 8, name: "hikari" },
        { month: 9, name: "tane" },
      ])
    ).toEqual([["moonViewing", 5]]);
  });

  it("matches Cherry Blossom Viewing", () => {
    expect(
      yakuMatcher.match([
        { month: 3, name: "hikari" },
        { month: 9, name: "tane" },
      ])
    ).toEqual([["cherryBlossomViewing", 5]]);
  });

  it("matches Boar, Deer, Butterflies", () => {
    expect(
      yakuMatcher.match([
        { month: 6, name: "tane" },
        { month: 7, name: "tane" },
        { month: 10, name: "tane" },
      ])
    ).toEqual([["boarDeerButterflies", 5]]);
  });

  it("matches Tane", () => {
    expect(
      yakuMatcher.match([
        { month: 2, name: "tane" },
        { month: 7, name: "tane" },
        { month: 10, name: "tane" },
      ])
    ).toEqual([]);

    expect(
      yakuMatcher.match([
        { month: 2, name: "tane" },
        { month: 4, name: "tane" },
        { month: 5, name: "tane" },
        { month: 6, name: "tane" },
        { month: 7, name: "tane" },
      ])
    ).toEqual([["tane", 1]]);

    expect(
      yakuMatcher
        .match([
          { month: 2, name: "tane" },
          { month: 4, name: "tane" },
          { month: 5, name: "tane" },
          { month: 6, name: "tane" },
          { month: 7, name: "tane" },
          { month: 8, name: "tane" },
          { month: 9, name: "tane" },
          { month: 10, name: "tane" },
          { month: 11, name: "tane" },
        ])
        .sort()
    ).toEqual(
      [
        ["tane", 5],
        ["boarDeerButterflies", 5],
      ].sort()
    );
  });

  it("matches Red Poetry Tanzaku", () => {
    expect(
      yakuMatcher.match([
        { month: 1, name: "tanzaku" },
        { month: 2, name: "tanzaku" },
        { month: 3, name: "tanzaku" },
      ])
    ).toEqual([["redPoetryTanzaku", 5]]);
  });

  it("matches Blue Tanzaku", () => {
    expect(
      yakuMatcher.match([
        { month: 6, name: "tanzaku" },
        { month: 9, name: "tanzaku" },
        { month: 10, name: "tanzaku" },
      ])
    ).toEqual([["blueTanzaku", 5]]);
  });

  it("matches Combined Red Poetry and Blue Tanzaku", () => {
    expect(
      yakuMatcher
        .match([
          { month: 1, name: "tanzaku" },
          { month: 2, name: "tanzaku" },
          { month: 3, name: "tanzaku" },
          { month: 6, name: "tanzaku" },
          { month: 9, name: "tanzaku" },
          { month: 10, name: "tanzaku" },
        ])
        .sort()
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
      yakuMatcher.match([
        { month: 1, name: "tanzaku" },
        { month: 2, name: "tanzaku" },
        { month: 6, name: "tanzaku" },
        { month: 9, name: "tanzaku" },
      ])
    ).toEqual([]);

    expect(
      yakuMatcher.match([
        { month: 1, name: "tanzaku" },
        { month: 2, name: "tanzaku" },
        { month: 6, name: "tanzaku" },
        { month: 9, name: "tanzaku" },
        { month: 11, name: "tanzaku" },
      ])
    ).toEqual([["tanzaku", 1]]);

    expect(
      yakuMatcher
        .match([
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
        ])
        .sort()
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
      yakuMatcher.match([
        { month: 1, name: "hikari" },
        { month: 1, name: "tanzaku" },
        { month: 1, name: "kasu" },
        { month: 1, name: "kasu" },
      ])
    ).toEqual([["monthlyCards", 4]]);

    expect(
      yakuMatcher.match([
        { month: 2, name: "tane" },
        { month: 2, name: "tanzaku" },
        { month: 2, name: "kasu" },
        { month: 2, name: "kasu" },
      ])
    ).toEqual([["monthlyCards", 4]]);

    expect(
      yakuMatcher.match([
        { month: 3, name: "hikari" },
        { month: 3, name: "tanzaku" },
        { month: 3, name: "kasu" },
        { month: 3, name: "kasu" },
      ])
    ).toEqual([["monthlyCards", 4]]);

    expect(
      yakuMatcher.match([
        { month: 12, name: "hikari" },
        { month: 12, name: "kasu" },
        { month: 12, name: "kasu" },
        { month: 12, name: "kasu" },
      ])
    ).toEqual([["monthlyCards", 4]]);
  });
});
