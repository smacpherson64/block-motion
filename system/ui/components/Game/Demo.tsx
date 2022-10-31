import { React } from "../../../dependencies/isometric.ts";
import {
  Block,
  isPlaceBaseEvent,
  isPlaceUnitEvent,
} from "../../components/Game/Block.tsx";
import Board from "../../components/Game/Board.tsx";
import { getColumn, getRow, Theme } from "../../../utils/board.ts";
import { Blocks, moveBlocks } from "../../../utils/game.ts";

export default function Demo(props: {
  theme: Theme;
  rows: number;
  columns: number;
}) {
  const { theme, rows, columns } = props;

  const [blocks, setBlocks] = React.useState<Blocks[]>([]);
  const [playing, setPlaying] = React.useState(false);

  const hasBase = !!blocks.find((block) => block.type === "base");

  React.useEffect(() => {
    if (playing) {
      const interval = setInterval(() => {
        setBlocks((blocks) => moveBlocks(blocks, rows, columns));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [playing]);

  const cells = React.useMemo(
    () =>
      new Array(rows * columns).fill(null).map((_, index) => {
        const column = getColumn(index, { columns });
        const row = getRow(index, { columns });

        return { column, row };
      }),
    [rows, columns]
  );

  return (
    <>
      <Board theme={theme} rows={rows} columns={columns} players={1}>
        {cells.map(({ column, row }, index) => {
          return (
            <Block
              key={`${column}-${row}-${index}`}
              blocks={blocks.filter(
                ({ row: thisRow, column: thisColumn }) =>
                  row === thisRow && column === thisColumn
              )}
              theme={theme}
              index={index}
              action={hasBase ? "PLACE_UNIT" : "PLACE_BASE"}
              player={1}
              row={row}
              column={column}
              onActivate={(data) => {
                if (isPlaceBaseEvent(data)) {
                  setBlocks((blocks) => [...blocks, data.payload]);
                }

                if (isPlaceUnitEvent(data)) {
                  if (
                    !blocks.find(
                      (block) =>
                        block.type === "unit" &&
                        block.direction === data.payload.direction &&
                        block.row === data.payload.row &&
                        block.column === data.payload.column
                    )
                  ) {
                    setBlocks((blocks) => [...blocks, data.payload]);
                  }
                }
              }}
            />
          );
        })}
      </Board>
      <div className="flex space-x-2 p-2">
        <button
          type="button"
          onClick={() => {
            setBlocks((blocks) => moveBlocks(blocks, rows, columns));
          }}
          className="p-2 px-3 bg-slate-900 text-white rounded"
        >
          Move Blocks
        </button>

        <button
          type="button"
          onClick={() => {
            setPlaying((current) => !current);
          }}
          className="p-2 px-3 bg-slate-900 text-white rounded"
        >
          {playing ? "pause" : "play"}
        </button>
      </div>
    </>
  );
}
