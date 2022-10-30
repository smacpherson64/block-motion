import * as React from "https://esm.sh/react@18.2.0/react.js";
import { Theme } from "../../utils/board.ts";
import { BaseBlock, Blocks, Directions, UnitBlock } from "../../utils/game.ts";
import { clamp } from "../../utils/numbers.ts";

export type BlockActions = "PLACE_BASE" | "PLACE_UNIT" | "NONE";

export type PlaceBaseEvent = {
  type: "PLACE_BASE";
  payload: BaseBlock;
};

export type PlaceUnitEvent = {
  type: "PLACE_UNIT";
  payload: UnitBlock;
};

export type BlockEvents = PlaceBaseEvent | PlaceUnitEvent;

export const isPlaceBaseEvent = (
  event: BlockEvents
): event is PlaceBaseEvent => {
  return event.type === "PLACE_BASE";
};

export const isPlaceUnitEvent = (
  event: BlockEvents
): event is PlaceUnitEvent => {
  return event.type === "PLACE_UNIT";
};

const getBounds = ({
  theme,
  row,
  column,
}: {
  theme: Theme;
  row: number;
  column: number;
}) => {
  const block = theme.blockSize;
  const halfBlock = theme.blockSize / 2;

  // TOP LEFT CORNER
  const x = column * block;
  const y = row * block;

  // CENTER
  const cx = x + halfBlock;
  const cy = y + halfBlock;

  // CLAMP
  const minX = cx + block * -1;
  const maxX = cx + block;
  const minY = cy + block * -1;
  const maxY = cy + block;

  const clampX = clamp(minX, maxX);
  const clampY = clamp(minY, maxY);

  return { x, y, cx, cy, minX, maxX, minY, maxY, halfBlock, clampX, clampY };
};

type Props = {
  theme: Theme;
  index: number;
  blocks?: Blocks[];
  onActivate?: (data: PlaceBaseEvent | PlaceUnitEvent) => void;
  emulatedDelta?: {
    x: number;
    y: number;
  };
  action: BlockActions;
  row: number;
  column: number;
  player: number;
};

export function Block(props: Props) {
  const {
    theme,
    index,
    emulatedDelta,
    action,
    column,
    row,
    player,
    onActivate = () => {},
    blocks = [],
  } = props;

  const lastTouchRef = React.useRef<React.Touch>();

  const { y, cx, cy, clampX, clampY, halfBlock } = React.useMemo(
    () => getBounds({ row, column, theme }),
    [row, column, theme]
  );

  const [manualDelta, setManualDelta] = React.useState({ x: 0, y: 0 });

  const delta = React.useMemo(
    () => (emulatedDelta ? emulatedDelta : manualDelta),
    [manualDelta, emulatedDelta]
  );

  const selectorPosition = React.useMemo(() => {
    return { x: clampX(cx + delta.x), y: clampY(cy + delta.y) };
  }, [delta.x, delta.y, clampX, clampY, cx, cy]);

  const direction = React.useMemo(() => {
    const left = selectorPosition.x < cx + halfBlock * -1;
    const right = selectorPosition.x > cx + halfBlock;
    const centerX = !left && !right;
    const top = selectorPosition.y < cy + halfBlock * -1;
    const bottom = selectorPosition.y > cy + halfBlock;
    const centerY = !top && !bottom;

    switch (true) {
      case left && top:
        return Directions.NE;
      case centerX && top:
        return Directions.N;
      case right && top:
        return Directions.NW;
      case left && centerY:
        return Directions.E;
      case right && centerY:
        return Directions.W;
      case left && bottom:
        return Directions.SE;
      case centerX && bottom:
        return Directions.S;
      case right && bottom:
        return Directions.SW;
      case centerX && centerY:
      default:
        return null;
    }
  }, [selectorPosition.x, selectorPosition.y, halfBlock, cx, cy]);

  const [isManuallyCapturing, setIsManuallyCapturing] = React.useState(false);

  const isCapturing = React.useMemo(
    () => !!emulatedDelta || isManuallyCapturing,
    [!!emulatedDelta, isManuallyCapturing]
  );

  const fill = React.useMemo(() => {
    if (blocks.find((block) => block.type === "base")) {
      return "fill-red-500";
    }

    if (isCapturing) {
      return "fill-slate-700";
    }

    if (blocks.find((block) => block.type === "unit")) {
      return "fill-white";
    }

    return "fill-transparent";
  }, [blocks, isCapturing]);

  if (action === "PLACE_BASE") {
    return (
      <g className="relative z-10">
        <rect
          onClick={() => {
            onActivate({
              type: action,
              payload: {
                type: "base",
                player,
                row,
                column,
              },
            });
          }}
          width={theme.blockSize}
          height={theme.blockSize}
          x={column * theme.blockSize}
          y={y}
          radius="10"
          className={fill}
        />
      </g>
    );
  }

  if (action === "PLACE_UNIT") {
    return (
      <g className="relative z-10">
        <rect
          onPointerDown={(event) => {
            const target = event.currentTarget;
            target.setPointerCapture(event.pointerId);

            setIsManuallyCapturing(true);
          }}
          onTouchMove={(event) => {
            if (isCapturing) {
              const touch = event.touches[0];
              const lastTouch = lastTouchRef.current;

              setManualDelta({
                x: lastTouch ? delta.x + touch.pageX - lastTouch.pageX : 0,
                y: lastTouch ? delta.y + touch.pageY - lastTouch.pageY : 0,
              });

              lastTouchRef.current = touch;
            }
          }}
          onTouchEnd={() => {
            lastTouchRef.current = undefined;
          }}
          onPointerMove={(event) => {
            if (isCapturing) {
              setManualDelta({
                x: delta.x + event.movementX,
                y: delta.y + event.movementY,
              });
            }
          }}
          onPointerUp={(event) => {
            const target = event.currentTarget;
            target.releasePointerCapture(event.pointerId);

            if (direction) {
              onActivate({
                type: "PLACE_UNIT",
                payload: {
                  type: "unit",
                  player,
                  row,
                  column,
                  direction,
                },
              });
            }

            setIsManuallyCapturing(false);
            setManualDelta({ x: 0, y: 0 });
          }}
          onPointerCancel={(event) => {
            const target = event.currentTarget;
            target.releasePointerCapture(event.pointerId);

            if (direction !== null) {
              onActivate({
                type: "PLACE_UNIT",
                payload: {
                  type: "unit",
                  player,
                  row,
                  column,
                  direction,
                },
              });
            }

            setIsManuallyCapturing(false);
            setManualDelta({ x: 0, y: 0 });
          }}
          width={theme.blockSize}
          height={theme.blockSize}
          x={column * theme.blockSize}
          y={y}
          radius="10"
          className={`select-none ${fill} touch-manipulation`}
        />
        {isCapturing ? (
          <>
            <path
              strokeLinecap="round"
              className="stroke-2 stroke-gray-400/30 z-10 relative"
              x={cx}
              y={cy}
              d={`M${cx} ${cy} L ${selectorPosition.x} ${selectorPosition.y} Z`}
            />
            <circle
              cx={selectorPosition.x}
              cy={selectorPosition.y}
              r={theme.blockSize * 0.18}
              className="fill-gray-700"
            />
          </>
        ) : null}
      </g>
    );
  }

  return (
    <rect
      width={theme.blockSize}
      height={theme.blockSize}
      x={column * theme.blockSize}
      y={y}
      radius="10"
      className={fill}
    />
  );
}
