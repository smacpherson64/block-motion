import { GameConfig } from "../utils/game.ts";
import { defaultGameSessionData, GameData } from "./Game.ts";
import { type ContextTypestate } from "./GameSessions.ts";

const defaultGameConfig: GameConfig = {
  speed: 200,
  lives: 3,
  max_units: 8,
  bases: 1,
  rows: 10,
  columns: 20,
  players: 2,
};

const DANGEROUS_GLOBAL_STATE: {
  [key: string]: ContextTypestate;
} = {
  "4766248d6c244b227c142a3c2285aef626265256d7630138bc6ad405": {
    value: "InProgress",
    context: {
      id: "4766248d6c244b227c142a3c2285aef626265256d7630138bc6ad405",
      config: defaultGameConfig,
      data: defaultGameSessionData,
    },
  },
};

export const api = {
  fetchGame: async (params: {
    id: string;
  }): Promise<{
    result:
      | {
          type: "success";
          payload: ContextTypestate;
        }
      | {
          type: "error";
          payload: never;
          error: any;
        };
  }> => {
    return {
      result: { type: "success", payload: DANGEROUS_GLOBAL_STATE?.[params.id] },
    };
  },
  configureGame: async (params: {
    id: string;
    config: GameConfig;
  }): Promise<{
    result:
      | {
          type: "success";
          payload: GameConfig;
        }
      | {
          type: "failure";
          error: any;
          payload: never;
        };
  }> => {
    return { result: { type: "success", payload: params.config } };
  },
  startGame: async function startGame(_params: { id: string }): Promise<{
    result:
      | {
          type: "success";
          payload: GameData;
        }
      | {
          type: "failure";
          error: any;
          payload: never;
        };
  }> {
    return {
      result: {
        type: "success",
        payload: {
          duration: 0,
          startedAt: new Date().toUTCString(),
          inactiveUnits: [],
          units: [],
          bases: [],
        },
      },
    };
  },
};
