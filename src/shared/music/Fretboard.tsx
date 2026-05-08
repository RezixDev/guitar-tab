import {
  createContext,
  useContext,
  useMemo,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@shared/lib/cn";
import type { Tuning } from "@shared/types/music";
import {
  FRET_COUNT,
  STRING_COUNT,
  fontOn,
  toDisplayIndex,
} from "./fretboardConstants";
import { FretboardGrid } from "./FretboardGrid";

type FretboardGeometry = {
  width: number;
  height: number;
  fretSpacing: number;
  stringSpacing: number;
  flipped: boolean;
  highContrast: boolean;
  /** Center-of-cell x for a 1-based fret number (1 = leftmost cell). */
  markerX: (fret: number) => number;
  /** Center-of-string y for a logical string index (0 = high E). */
  markerY: (string: number) => number;
};

const FretboardContext = createContext<FretboardGeometry | null>(null);

export function useFretboardGeometry(): FretboardGeometry {
  const ctx = useContext(FretboardContext);
  if (!ctx) {
    throw new Error("Fretboard children must be rendered inside <Fretboard>");
  }
  return ctx;
}

type FretboardProps = {
  tuning: Tuning;
  width: number;
  height: number;
  /** When true (default), high E (logical string 0) is rendered on top. */
  flipped?: boolean;
  /** Black background + grayscale palette for the game's high-contrast mode. */
  highContrast?: boolean;
  className?: string;
  /** Children render inside `<g transform="translate(40, 0)">` so coordinates
   *  computed from `useFretboardGeometry` are already in the correct frame. */
  children?: ReactNode;
  onKeyDown?: (e: KeyboardEvent<SVGSVGElement>) => void;
  tabIndex?: number;
  role?: string;
  ariaLabel?: string;
};

/**
 * Shared SVG fretboard container used by both the fretboard trainer (game) and
 * the scales viewer. Renders the static grid (string lines, fret lines, fret
 * numbers, string-name labels) and exposes geometry via context so child
 * `<FretboardMarker>` components can place themselves consistently.
 */
export function Fretboard({
  tuning,
  width,
  height,
  flipped = true,
  highContrast = false,
  className,
  children,
  onKeyDown,
  tabIndex,
  role,
  ariaLabel,
}: FretboardProps) {
  const geometry = useMemo<FretboardGeometry>(() => {
    const stringSpacing = height / (STRING_COUNT + 1);
    const fretSpacing = width / (FRET_COUNT + 1);
    return {
      width,
      height,
      fretSpacing,
      stringSpacing,
      flipped,
      highContrast,
      // 1-based fret: fret 1 sits in the leftmost cell, centered at fretSpacing*0.5
      markerX: (fret) => fretSpacing * (fret - 0.5),
      markerY: (string) =>
        stringSpacing * (toDisplayIndex(string, flipped) + 1),
    };
  }, [width, height, flipped, highContrast]);

  const stroke = highContrast ? "white" : "currentColor";

  return (
    <svg
      width="100%"
      height="auto"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "rounded-lg border border-[var(--color-border)]",
        highContrast ? "bg-black" : "bg-[var(--color-bg-elevated)]",
        className,
      )}
      tabIndex={tabIndex}
      role={role}
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
    >
      <FretboardGrid
        tuning={tuning}
        width={width}
        height={height}
        flipped={flipped}
        stroke={stroke}
      />
      <FretboardContext.Provider value={geometry}>
        <g transform="translate(40, 0)">{children}</g>
      </FretboardContext.Provider>
    </svg>
  );
}

export type MarkerSize = "cell" | "highlight" | number;

type FretboardMarkerProps = {
  /** Logical string index (0 = high E). */
  string: number;
  /** 1-based fret number (1 = first fret). */
  fret: number;
  /**
   * `"cell"` — `fretSpacing/4` (matches each cell of the 12×6 grid).
   * `"highlight"` — 12 SVG units (matches the legacy target/guessed overlay).
   * `number` — explicit radius in SVG units.
   */
  size?: MarkerSize;
  /** Circle fill. Defaults to `"transparent"`. */
  fill?: string;
  /** Circle stroke. Defaults to `"none"`. */
  stroke?: string;
  strokeWidth?: number;
  /** Centered text label (e.g. note name). */
  label?: string;
  /**
   * Color for `label`. Defaults to a contrast-aware color: `currentColor` over
   * a transparent fill, or black/white via `fontOn(fill)` over a colored fill.
   */
  labelFill?: string;
  /** When provided, renders the marker as a clickable `role="button"` group. */
  onClick?: () => void;
  ariaLabel?: string;
};

/**
 * A note dot at a logical (string, fret) coordinate. Uses geometry from the
 * surrounding `<Fretboard>` so all markers stay aligned with the grid.
 */
export function FretboardMarker({
  string,
  fret,
  size = "cell",
  fill = "transparent",
  stroke,
  strokeWidth,
  label,
  labelFill,
  onClick,
  ariaLabel,
}: FretboardMarkerProps) {
  const geo = useFretboardGeometry();
  const cx = geo.markerX(fret);
  const cy = geo.markerY(string);
  const r =
    size === "cell"
      ? geo.fretSpacing / 4
      : size === "highlight"
        ? 12
        : size;
  const computedLabelFill =
    labelFill ?? (fill === "transparent" ? "currentColor" : fontOn(fill));

  return (
    <g
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : undefined}
      role={onClick ? "button" : undefined}
      aria-label={ariaLabel}
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={fill}
        stroke={stroke ?? "none"}
        strokeWidth={strokeWidth ?? 0}
      />
      {label !== undefined && (
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          fontSize="10"
          fill={computedLabelFill}
          style={{ pointerEvents: "none" }}
        >
          {label}
        </text>
      )}
    </g>
  );
}
