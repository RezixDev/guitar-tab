import { Fretboard, FretboardMarker } from "@shared/music/Fretboard";
import { NORMAL_COLORS } from "@shared/music/fretboardConstants";
import type { NotePosition, Tuning } from "@shared/types/music";

type FretboardScalesProps = {
  tuning: Tuning;
  width: number;
  height: number;
  onFretClick: (stringIndex: number, fretIndex: number) => void;
  chordPositions: NotePosition[];
  easyMode: boolean;
};

export function FretboardScales({
  tuning,
  width,
  height,
  onFretClick,
  chordPositions,
  easyMode,
}: FretboardScalesProps) {
  return (
    <div className="relative w-full overflow-x-auto">
      <Fretboard tuning={tuning} width={width} height={height}>
        {chordPositions.map(({ string, fret, note }) => {
          const fill = easyMode
            ? (NORMAL_COLORS[note] ?? "transparent")
            : "transparent";
          return (
            <FretboardMarker
              key={`scale-${string}-${fret}`}
              string={string}
              fret={fret}
              fill={fill}
              label={easyMode ? note : undefined}
              onClick={() => onFretClick(string, fret)}
              ariaLabel={`String ${string + 1}, Fret ${fret}, Note ${note}`}
            />
          );
        })}
      </Fretboard>
    </div>
  );
}
