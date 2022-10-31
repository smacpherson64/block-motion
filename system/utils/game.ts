import { wrap } from "./numbers.ts";

export const BlockTypes = {
  unit: "unit",
  base: "base",
} as const;

export const Directions = {
  NE: 0b00000001,
  N: 0b00000010,
  NW: 0b00000100,
  E: 0b00001000,
  W: 0b00010000,
  SE: 0b00100000,
  S: 0b01000000,
  SW: 0b10000000,
};

export type UnitBlock = {
  player: number;
  type: typeof BlockTypes["unit"];
  direction: number;
  row: number;
  column: number;
};

export type BaseBlock = {
  player: number;
  type: typeof BlockTypes["base"];
  row: number;
  column: number;
};

export type Blocks = UnitBlock | BaseBlock;

export const moveBlocks = (blocks: Blocks[], rows: number, columns: number) => {
  const wrapRow = wrap(0, rows - 1);
  const wrapColumn = wrap(0, columns - 1);

  return blocks.map((block) => {
    if (block.type === "base") {
      return block;
    }

    if (block.type === "unit") {
      const { row, column } = block;

      const previousRow = wrapRow(row - 1);
      const nextRow = wrapRow(row + 1);
      const previousColumn = wrapColumn(column - 1);
      const nextColumn = wrapColumn(column + 1);

      switch (block.direction) {
        case Directions.NE: {
          return { ...block, row: previousRow, column: previousColumn };
        }
        case Directions.N: {
          return { ...block, row: previousRow, column: column };
        }
        case Directions.NW: {
          return { ...block, row: previousRow, column: nextColumn };
        }
        case Directions.E: {
          return { ...block, row: row, column: previousColumn };
        }
        case Directions.W: {
          return { ...block, row: row, column: nextColumn };
        }
        case Directions.SE: {
          return { ...block, row: nextRow, column: previousColumn };
        }
        case Directions.S: {
          return { ...block, row: nextRow, column: column };
        }
        case Directions.SW: {
          return { ...block, row: nextRow, column: nextColumn };
        }
        default:
          return block;
      }
    }

    return block;
  });
};

export type GameConfig = {
  speed: number;
  lives: number;
  max_units: number;
  bases: number;
  rows: number;
  columns: number;
  players: number;
};

export const defaultGameConfig: GameConfig = {
  speed: 200,
  lives: 3,
  max_units: 8,
  bases: 1,
  rows: 10,
  columns: 20,
  players: 2,
};

type Actions =
  | {
      type: "PLAYER_REQUESTED_GAME_CONFIG_CHANGE";
      payload: Partial<GameConfig>;
    }
  | {
      type: "PLAYER_REQUESTED_UNIT_CELL";
      payload: {
        index: number;
        player: number;
        direction: number;
      };
    }
  | {
      type: "SYSTEM_RECEIVED_GAME_TICK";
    };

export type GameState = {
  config: GameConfig;
  blocks: Blocks[];
};

export const getDefaultState = (config: GameConfig) => ({
  config,
  blocks: [],
});

export const gameReducer = (
  state: GameState = getDefaultState(defaultGameConfig),
  action: Actions
): GameState => {
  switch (action.type) {
    case "PLAYER_REQUESTED_UNIT_CELL": {
      const nextBlocks = [...state.blocks];

      const nextBlockValue: Blocks = {
        type: BlockTypes.unit,
        ...action.payload,
      };

      nextBlocks[action.payload.index] = nextBlockValue;
      return { ...state, blocks: nextBlocks };
    }

    case "SYSTEM_RECEIVED_GAME_TICK": {
      const nextBlocks = moveBlocks(
        state.blocks,
        state.config.rows,
        state.config.columns
      );
      return { ...state, blocks: nextBlocks };
    }

    default: {
      return state;
    }
  }
};
