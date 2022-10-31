import { xstate } from "../dependencies/isometric.ts";

import { GameConfig } from "../utils/game.ts";
import { hash } from "../utils/hash.ts";
import { GameData } from "./Game.ts";
import { api } from "./api.ts";

// Events
type InitialEvents =
  | { type: "NO_SESSION_FOUND"; payload: { id: string } }
  | {
      type: "PENDING_SESSION_RESTORED";
      payload: {
        id: string;
        config: GameConfig;
      };
    }
  | {
      type: "IN_PROGRESS_SESSION_RESTORED";
      payload: {
        id: string;
        config: GameConfig;
        data: GameData;
      };
    }
  | {
      type: "COMPLETED_SESSION_RESTORED";
      payload: {
        id: string;
        config: GameConfig;
        data: GameData & {
          completedAt: string;
        };
      };
    };

type NewGameEvents = {
  type: "GAME_CREATED";
  payload: { config: GameConfig };
};

type PendingGameEvents = { type: "PLAYER_SELECTED" };

type InProgressGameEvents = { type: "GAME_COMPLETED" };

type CompletedGameEvents = { type: "GAME_ARCHIVED" };

type Events =
  | InitialEvents
  | NewGameEvents
  | PendingGameEvents
  | InProgressGameEvents
  | CompletedGameEvents;

type Context = {
  id?: string;
  config?: GameConfig;
  data?: GameData & { completedAt?: string };
};

export type ContextTypestate =
  | {
      value: "Initial";
      context: {};
    }
  | {
      value: "NewGame";
      context: { id: string };
    }
  | {
      value: "Pending";
      context: {
        id: string;
        config: GameConfig;
      };
    }
  | {
      value: "InProgress";
      context: {
        id: string;
        config: GameConfig;
        data: GameData;
      };
    }
  | {
      value: "Completed";
      context: {
        id: string;
        config: GameConfig;
        data: GameData & { completedAt: string };
      };
    };

type EventsByState<S extends ContextTypestate["value"]> = S extends "Initial"
  ? InitialEvents
  : S extends "NewGame"
  ? NewGameEvents
  : S extends "Pending"
  ? PendingGameEvents
  : S extends "InProgress"
  ? InProgressGameEvents
  : S extends "Completed"
  ? CompletedGameEvents
  : never;

type SendByState<S extends ContextTypestate["value"]> = S extends "Initial"
  ? InitialEvents
  : S extends "NewGame"
  ? NewGameEvents
  : S extends "Pending"
  ? PendingGameEvents
  : S extends "InProgress"
  ? InProgressGameEvents
  : S extends "Completed"
  ? CompletedGameEvents
  : never;

// Machine

export const GameSessionMachine = xstate.createMachine<
  Context,
  Events,
  ContextTypestate
>({
  id: "GameSessionMachine",
  initial: "Initial",
  states: {
    Initial: {
      on: {
        NO_SESSION_FOUND: "NewGame",
        PENDING_SESSION_RESTORED: "Pending",
        IN_PROGRESS_SESSION_RESTORED: "InProgress",
        COMPLETED_SESSION_RESTORED: "Completed",
      },
    },
    NewGame: {
      on: {
        GAME_CREATED: "Pending",
      },
    },
    Pending: {
      on: {
        PLAYER_SELECTED: "InProgress",
      },
    },
    InProgress: {
      on: {
        GAME_COMPLETED: "Completed",
      },
    },
    Completed: {
      on: {
        GAME_ARCHIVED: "NewGame",
      },
    },
  },
  schema: {
    context: {} as ContextTypestate["context"],
    events: {} as Events,
  },
  context: {},
  predictableActionArguments: true,
  preserveActionOrder: true,
});

async function getInitialSession(options: {
  game: string;
}): Promise<InitialEvents> {
  const id = await hash(options.game);
  const { result } = await api.fetchGame({ id });

  if (result.type === "error") {
    return { type: "NO_SESSION_FOUND", payload: { id } };
  }

  switch (result.payload.value) {
    case "Pending":
      return {
        type: "PENDING_SESSION_RESTORED",
        payload: result.payload.context,
      };

    case "InProgress":
      return {
        type: "IN_PROGRESS_SESSION_RESTORED",
        payload: result.payload.context,
      };

    case "Completed":
      return {
        type: "COMPLETED_SESSION_RESTORED",
        payload: result.payload.context,
      };

    case "NewGame":
    default:
      return { type: "NO_SESSION_FOUND", payload: { id } };
  }
}
