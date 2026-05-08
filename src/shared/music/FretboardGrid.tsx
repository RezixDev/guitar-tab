import { useMemo } from "react";
import type { Tuning } from "@shared/types/music";
import {
  FRET_COUNT,
  STRING_COUNT,
  toDisplayIndex,
} from "./fretboardConstants";

type FretboardGridProps = {
  tuning: Tuning;
  width: number;
  height: number;
  /** When true, high E sits on top (default tab orientation). */
  flipped?: boolean;
  /** SVG stroke for strings, frets, numbers, and string-name text. */
  stroke?: string;
};

/**
 * Static grid layer of a guitar fretboard: 6 string lines, 13 fret lines (with
 * a thicker nut), fret-number labels along the bottom, and string-name labels
 * along the left. Layout is `translate(40, 0)` so the string-name column has
 * room. Consumers compose their own interactive layer on top inside the same
 * `<svg>` viewBox by reusing the same width/height.
 */
export function FretboardGrid({
  tuning,
  width,
  height,
  flipped = true,
  stroke = "currentColor",
}: FretboardGridProps) {
  const stringSpacing = height / (STRING_COUNT + 1);
  const fretSpacing = width / (FRET_COUNT + 1);

  const strings = useMemo(
    () => Array.from({ length: STRING_COUNT }, (_, i) => i),
    [],
  );
  const frets = useMemo(
    () => Array.from({ length: FRET_COUNT }, (_, i) => i),
    [],
  );

  return (
    <>
      <g transform="translate(40, 0)">
        {strings.map((i) => (
          <line
            key={`string-${i}`}
            x1={0}
            y1={stringSpacing * (i + 1)}
            x2={width}
            y2={stringSpacing * (i + 1)}
            stroke={stroke}
            strokeWidth={2}
          />
        ))}
        {Array.from({ length: FRET_COUNT + 1 }, (_, i) => (
          <line
            key={`fret-${i}`}
            x1={fretSpacing * i}
            y1={0}
            x2={fretSpacing * i}
            y2={height}
            stroke={stroke}
            strokeWidth={i === 0 ? 4 : 2}
          />
        ))}
        {frets.map((i) => (
          <text
            key={`fret-number-${i}`}
            x={fretSpacing * (i + 1) - fretSpacing / 2}
            y={height - 10}
            textAnchor="middle"
            fontSize="12"
            fill={stroke}
          >
            {i + 1}
          </text>
        ))}
      </g>

      <g>
        {tuning.map((note, logicalIndex) => {
          const displayIndex = toDisplayIndex(logicalIndex, flipped);
          return (
            <text
              key={`string-name-${logicalIndex}`}
              x={20}
              y={stringSpacing * (displayIndex + 1) + 5}
              textAnchor="middle"
              fontSize="12"
              fill={stroke}
            >
              {note}
            </text>
          );
        })}
      </g>
    </>
  );
}
