import * as React from "https://esm.sh/react@18.2.0/react.js";

import {
  gameReducer,
  getDefaultState,
  defaultGameConfig,
} from "../../utils/game.ts";
import { defaultTheme } from "../../utils/board.ts";

import Board from "./Board.tsx";
import { Block } from "./Block.tsx";

function Game({ player = 1 }) {
  const theme = React.useMemo(() => defaultTheme, []);
  const [state, dispatch] = React.useReducer(
    gameReducer,
    getDefaultState(defaultGameConfig)
  );

  return (
    <main className="grid place-items-center w-full">
      <div>
        <div className="grid place-items-center">
          <div className="text-white rounded-t-md px-12  text-xs text-left  md:py-2 md:bg-slate-800">
            <strong>Game</strong>
          </div>
        </div>
        <div className="flex align-center justify-center">
          <div className="grid place-items-center">
            <div className="rounded-l-md border border-slate-700 flex flex-col overflow-hidden divide-y divide-slate-700">
              <div className="h-3 w-3 md:h-5 md:w-5 bg-slate-700"></div>
              <div className="h-3 w-3 md:h-5 md:w-5 bg-slate-700"></div>
              <div className="h-3 w-3 md:h-5 md:w-5 bg-slate-400"></div>
              <div className="h-3 w-3 md:h-5 md:w-5 bg-slate-400"></div>
              <div className="h-3 w-3 md:h-5 md:w-5 bg-slate-400"></div>
              <div className="h-3 w-3 md:h-5 md:w-5 bg-slate-400"></div>
              <div className="h-3 w-3 md:h-5 md:w-5 bg-slate-400"></div>
              <div className="h-3 w-3 md:h-5 md:w-5 bg-slate-400"></div>
              <div className="h-3 w-3 md:h-5 md:w-5 bg-slate-400"></div>
              <div className="h-3 w-3 md:h-5 md:w-5 bg-slate-400"></div>
            </div>
          </div>

          <Board
            theme={theme}
            rows={state.config.rows}
            players={state.config.players}
            columns={state.config.columns}
          >
            {state.cells.map((cell, index) => {
              return (
                <Block
                  theme={theme}
                  key={index}
                  cell={cell}
                  index={index}
                  columns={state.config.columns}
                  onActivateCell={(values) => {
                    const { index, direction } = values;

                    if (direction) {
                      dispatch({
                        type: "PLAYER_REQUESTED_UNIT_CELL",
                        payload: { index, player, direction },
                      });
                    }
                  }}
                />
              );
            })}
          </Board>

          <div className="grid place-items-center">
            <div className="rounded-r-md border border-slate-700 flex flex-col overflow-hidden divide-y divide-slate-700">
              <div className="h-3 w-3 md:h-5 md:w-5 bg-slate-700"></div>
              <div className="h-3 w-3 md:h-5 md:w-5 bg-slate-700"></div>
              <div className="h-3 w-3 md:h-5 md:w-5 bg-slate-400"></div>
              <div className="h-3 w-3 md:h-5 md:w-5 bg-slate-400"></div>
              <div className="h-3 w-3 md:h-5 md:w-5 bg-slate-400"></div>
              <div className="h-3 w-3 md:h-5 md:w-5 bg-slate-400"></div>
              <div className="h-3 w-3 md:h-5 md:w-5 bg-slate-400"></div>
              <div className="h-3 w-3 md:h-5 md:w-5 bg-slate-400"></div>
              <div className="h-3 w-3 md:h-5 md:w-5 bg-slate-400"></div>
              <div className="h-3 w-3 md:h-5 md:w-5 bg-slate-400"></div>
            </div>
          </div>
        </div>

        <div className="flex align-start justify-between space-x-12 px-12">
          <div className="flex-1 flex rounded-b-md overflow-hidden divide-x divide-slate-900">
            <div className="bg-slate-400 flex-1 h-3"></div>
            <div className="bg-slate-400 flex-1 h-3"></div>
            <div className="bg-slate-400 flex-1 h-3"></div>
          </div>

          <div className="flex-1 flex rounded-b-md overflow-hidden divide-x divide-slate-900">
            <div className="bg-slate-700 flex-1 h-3"></div>
            <div className="bg-slate-400 flex-1 h-3"></div>
            <div className="bg-slate-400 flex-1 h-3"></div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Game;
