import * as React from "https://esm.sh/react@18.2.0/react.js";
import { getColumn, getRow, Theme } from "../../utils/board.ts";

type BoardProps = {
  theme: Theme;
  rows: number;
  columns: number;
  players: number;
  children: React.ReactNode;
};

export default function Board(props: BoardProps) {
  const { theme, children, players, rows, columns } = props;
  const { height, width } = React.useMemo(
    () => ({
      height: theme.blockSize * rows,
      width: theme.blockSize * columns,
    }),
    [theme.blockSize, rows, columns]
  );

  const grid = React.useMemo(() => {
    return new Array(rows * columns).fill(null).map((_, index) => {
      const row = getRow(index, { columns });
      const column = getColumn(index, { columns });
      const y = row * theme.blockSize;

      return (
        <rect
          key={index}
          width={theme.blockSize}
          height={theme.blockSize}
          x={column * theme.blockSize}
          y={y}
          radius="10"
          strokeWidth={theme.gap}
          className={`relative z-0 select-none stroke-slate-800 fill-transparent`}
        />
      );
    });
  }, []);

  return (
    <div className="overflow-hidden bg-slate-900 border-2 border-gray-700 rounded-md relative select-none">
      <svg
        height={height}
        width={width}
        viewBox={`0 0 ${width} ${height}`}
        className="relative"
      >
        {players === 2 ? (
          <rect
            x={width / 2 - 2.5}
            y="0"
            height={height}
            width={5}
            className="fill-slate-800 z-0"
          />
        ) : null}
        {grid}
        {children}
      </svg>
    </div>
  );
}
