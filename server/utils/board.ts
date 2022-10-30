export type Theme = {
  gap: number;
  blockSize: number;
};

export const defaultTheme: Theme = {
  gap: 1,
  blockSize: 25,
};

export const getRow = (index: number, { columns }: { columns: number }) =>
  Math.floor(index / columns);

export const getColumn = (index: number, { columns }: { columns: number }) =>
  index % columns;

export const getIndex = (columns: number) => (row: number, column: number) =>
  row * columns + column;
