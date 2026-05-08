import type { ChordSVGProps, ChordNote, ChordTheme } from "@shared/types/chord";
import { chordThemes } from "../data/themes";

type NormalizedNote = {
  stringIndex: number;
  fret: number | null;
  finger: number;
};

const STRING_NOTES = ["E2", "A2", "D3", "G3", "B3", "E4"] as const;
const FRET_NOTES = [
  ["E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3"],
  ["A2", "A#2", "B2", "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3"],
  ["D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", "C4", "C#4"],
  ["G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4"],
  ["B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4"],
  ["E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5", "C#5", "D5", "D#5"],
] as const;

const getNoteName = (stringIndex: number, fret: number | null): string => {
  if (fret == null || fret < 0) return "";
  const idx = 5 - stringIndex;
  if (fret === 0) return STRING_NOTES[idx];
  return FRET_NOTES[idx][fret % 12] || "";
};

const normalizeChordData = (notes: ChordNote[]): NormalizedNote[] =>
  notes.map((note, stringIndex) => ({
    stringIndex,
    fret: note.fret,
    finger: note.finger ?? 0,
  }));

const renderMarker = (
  cx: number,
  cy: number,
  theme: ChordTheme,
  finger: number,
  key: string,
) => {
  const size = 12;
  const fingerLabel = theme.showFingerNumbers && finger > 0 ? finger : null;
  const stroke = theme.shadow ? "rgba(0,0,0,0.2)" : "none";
  const strokeWidth = theme.shadow ? 2 : 0;

  const shape =
    theme.markerStyle === "square" ? (
      <rect
        x={cx - size}
        y={cy - size}
        width={size * 2}
        height={size * 2}
        fill={theme.markerColor}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    ) : theme.markerStyle === "diamond" ? (
      <path
        d={`M ${cx} ${cy - size} L ${cx + size} ${cy} L ${cx} ${cy + size} L ${cx - size} ${cy} Z`}
        fill={theme.markerColor}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    ) : (
      <circle
        cx={cx}
        cy={cy}
        r={size}
        fill={theme.markerColor}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    );

  return (
    <g key={key}>
      {shape}
      {fingerLabel != null && (
        <text
          x={cx}
          y={cy + 5}
          textAnchor="middle"
          fontSize="14"
          fontFamily={theme.fontFamily}
          fill={theme.markerTextColor}
          fontWeight="bold"
        >
          {fingerLabel}
        </text>
      )}
    </g>
  );
};

function ChordDiagram({
  notes,
  chordName,
  startingFret,
  theme,
}: {
  notes: NormalizedNote[];
  chordName: string;
  startingFret: number;
  theme: ChordTheme;
}) {
  const width = 300;
  const height = 400;
  const stringSpacing = width / 7;
  const fretSpacing = height / 6;
  const textMargin = theme.showStringNames ? 80 : 60;
  const leftMargin = 40;
  const rightMargin = 40;
  const topMargin = 20;
  const fretLineWidth = width - 40;

  const stringNames = ["E", "A", "D", "G", "B", "e"];
  const strings = [0, 1, 2, 3, 4, 5];
  const frets = [0, 1, 2, 3, 4];

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width + leftMargin + rightMargin} ${height + textMargin}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="chordTitle chordDesc"
      role="img"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <title id="chordTitle">{chordName} Guitar Chord Diagram</title>
      <desc id="chordDesc">Visual fingering for the {chordName} guitar chord</desc>

      <text
        x="50%"
        y={textMargin / 2}
        textAnchor="middle"
        fontSize="24"
        fontFamily={theme.fontFamily}
        fontWeight="bold"
        fill={theme.textColor}
      >
        {chordName}
      </text>

      {theme.showStringNames &&
        strings.map((_, i) => (
          <text
            key={`string-name-${i}`}
            x={stringSpacing * (i + 1) + leftMargin}
            y={height + textMargin - 80}
            textAnchor="middle"
            fontSize="18"
            fontFamily={theme.fontFamily}
            fill={theme.textColor}
          >
            {stringNames[i]}
          </text>
        ))}

      {strings.map((_, i) => (
        <line
          key={`string-${i}`}
          x1={stringSpacing * (i + 1) + leftMargin}
          y1={textMargin + topMargin}
          x2={stringSpacing * (i + 1) + leftMargin}
          y2={height + textMargin - 100}
          stroke={theme.stringColor}
          strokeWidth="1"
        />
      ))}

      {frets.map((_, i) => (
        <line
          key={`fret-${i}`}
          x1={leftMargin + 20}
          y1={fretSpacing * i + textMargin + topMargin}
          x2={leftMargin + fretLineWidth + 20}
          y2={fretSpacing * i + textMargin + topMargin}
          stroke={i === 0 ? theme.nutColor : theme.fretColor}
          strokeWidth={i === 0 ? "3" : "2"}
        />
      ))}

      {theme.showFretNumbers &&
        frets.slice(1).map((_, i) => (
          <text
            key={`fret-number-${i}`}
            x={width + leftMargin + 10}
            y={fretSpacing * (i + 0.5) + textMargin + topMargin}
            textAnchor="middle"
            fontSize="16"
            fontFamily={theme.fontFamily}
            fill={theme.textColor}
          >
            {startingFret + i}
          </text>
        ))}

      {notes.map((note) => {
        const { stringIndex, fret, finger } = note;
        const xPosition = stringSpacing * (6 - stringIndex) + leftMargin;

        if (fret === 0 || fret === null) {
          const symbol = fret === 0 ? "O" : "X";
          const color = fret === 0 ? theme.openStringColor : theme.mutedColor;
          return (
            <text
              key={`open-${stringIndex}`}
              x={xPosition}
              y={textMargin + topMargin - 10}
              textAnchor="middle"
              fontSize="20"
              fontFamily={theme.fontFamily}
              fill={color}
              fontWeight="bold"
            >
              {symbol}
            </text>
          );
        }

        const visualFret = fret - startingFret + 1;
        if (visualFret >= 1 && visualFret <= 5) {
          const cy = fretSpacing * visualFret + textMargin + topMargin - fretSpacing / 2;
          return renderMarker(xPosition, cy, theme, finger, `note-${stringIndex}`);
        }
        return null;
      })}
    </svg>
  );
}

export function ChordSVG({
  chord,
  chordName,
  startingFret,
  theme = chordThemes.classic,
}: ChordSVGProps) {
  const normalizedNotes = normalizeChordData(chord);
  const noteNames = [...normalizedNotes]
    .reverse()
    .map((n) => (n.fret == null ? null : getNoteName(n.stringIndex, n.fret)))
    .filter(Boolean) as string[];

  return (
    <div
      className="rounded-lg p-4"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className="mx-auto max-w-md">
        <ChordDiagram
          notes={normalizedNotes}
          chordName={chordName}
          startingFret={startingFret}
          theme={theme}
        />
      </div>
      {theme.showStringNames && (
        <div className="mt-4 text-center" style={{ color: theme.textColor }}>
          <strong className="block mb-2" style={{ fontFamily: theme.fontFamily }}>
            Notes:
          </strong>
          <p className="text-lg" style={{ fontFamily: theme.fontFamily }}>
            {noteNames.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
