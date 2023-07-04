import miorineAIPlayer from "../../game/aiPlayers/miorine";
import { AIPlayer, AIPlayerCodeNames } from "../gameTypes";

const AIPlayers: { [key in AIPlayerCodeNames]: AIPlayer } = {
  miorine: miorineAIPlayer,
  dummyPlug: miorineAIPlayer,
  kamina: miorineAIPlayer,
  tachikoma: miorineAIPlayer,
  suletta: miorineAIPlayer,
};

export const wipPlayers: { [key in AIPlayerCodeNames]: boolean } = {
  miorine: false,
  dummyPlug: true,
  kamina: true,
  tachikoma: true,
  suletta: true,
};

export default AIPlayers;
