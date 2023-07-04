import aiInterface from "../../game/aiPlayers/aiInterface";
import miorine from "../../game/aiPlayers/miorine";
import game from "../../game/game";

describe("aiPlayerInterface, miorine", () => {
  it("can properly play a round", () => {
    const gameInstance = game({ testMode: true });
    let x = 16;
    gameInstance.chooseOya();
    gameInstance.setup();

    while (gameInstance.phase != "setup" && x >= 0) {
      let result = true;
      while (result === true) {
        result = aiInterface(
          gameInstance,
          miorine,
          gameInstance.oya
        ).turnInProgress;
      }

      if (gameInstance.phase == "setup") break;

      result = true;
      while (result === true) {
        result = aiInterface(
          gameInstance,
          miorine,
          gameInstance.ko
        ).turnInProgress;
      }

      if (gameInstance.phase == "setup") break;

      x -= 1;
    }

    expect(gameInstance.phase).toBe("setup");
  });
});
