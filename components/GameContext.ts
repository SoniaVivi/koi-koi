import { createContext } from "react";
import game from "../game/game";

export const GameContext = createContext(game());
