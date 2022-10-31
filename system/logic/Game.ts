// Game Types

export type ActiveUnitState = {
  direction: number;
  row: number;
  column: number;
  player: number;
  /** The time in millisceconds from game start for when this was added. */
  activated: number;
};

export type InActiveUnitState = {
  /** The time in millisceconds from game start for when this was removed. */
  deactivated: 0;
} & ActiveUnitState;

export type UnitState = ActiveUnitState | InActiveUnitState;

export type BaseState = {
  player: number;
  row: number;
  column: number;
  /** The time in millisceconds from game start for when this was added. */
  activated: number;
};

export type GameData = {
  startedAt: string;
  duration: number;
  inactiveUnits: InActiveUnitState[];
  units: UnitState[];
  bases: BaseState[];
};

export const defaultGameSessionData: GameData = {
  startedAt: new Date().toUTCString(),
  duration: 0,
  inactiveUnits: [],
  units: [],
  bases: [],
};
