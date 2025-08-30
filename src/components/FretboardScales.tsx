import { useMemo } from "react"
import type { Tuning, NotePosition } from "@/utils/noteUtils"

type FretboardSVGProps = {
  tuning: Tuning
  width: number
  height: number
  onFretClick: (stringIndex: number, fretIndex: number) => void
  showNext: boolean
  currentNote: { string: number; fret: number; note: string }
  guessedPositions: NotePosition[]
  chordPositions: NotePosition[]
  easyMode: boolean
}

const NOTE_COLORS = {
		A: "#1D7669",
		"A#": "#3FB82D",
		B: "#A5E906",
		C: "#FEF200",
		"C#": "#FBC40F",
		D: "#f7c68d",
		"D#": "#F36B2C",
		E: "#C73333",
		F: "#B84098",
		"F#": "#5D25BE",
		G: "#5251EB",
		"G#": "#1767FC",
} as const

const getLuminance = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const lin = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
}

const fontOn = (bg: string) => (getLuminance(bg) > 0.5 ? "#000000" : "#FFFFFF")

export function FretboardScales({
  tuning,
  width,
  height,
  onFretClick,
  chordPositions,
  easyMode,
}: FretboardSVGProps) {
  const stringCount = 6
  const fretCount = 12
  const stringSpacing = height / (stringCount + 1)
  const fretSpacing = width / (fretCount + 1)

  const strings = useMemo(() => Array.from({ length: stringCount }, (_, i) => i), [])
  const frets = useMemo(() => Array.from({ length: fretCount }, (_, i) => i), [])
  
		return (
    <div className="relative w-full overflow-x-auto">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        className="rounded-lg border border-gray-300 shadow-md"
		  >
        <g transform="translate(40, 0)">
          {strings.map((i) => (
			<line
				key={`string-${i}`}
				x1={0}
				y1={stringSpacing * (i + 1)}
				x2={width}
				y2={stringSpacing * (i + 1)}
				stroke="black"
              strokeWidth={2}
			/>
          ))}

          {Array.from({ length: fretCount + 1 }, (_, i) => (
			<line
				key={`fret-${i}`}
				x1={fretSpacing * i}
				y1={0}
				x2={fretSpacing * i}
				y2={height}
				stroke="black"
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
				fontFamily="Arial"
				fill="black"
			>
				{i + 1}
			</text>
          ))}

          {chordPositions.map(({ string, fret, note }) => {
            const bg = easyMode ? NOTE_COLORS[note as keyof typeof NOTE_COLORS] ?? "transparent" : "transparent"
            const fg = bg === "transparent" ? "#000000" : fontOn(bg)
			return (
				<g
					key={`fret-note-${string}-${fret}`}
					onClick={() => onFretClick(string, fret)}
					style={{ cursor: "pointer" }}
                role="button"
                tabIndex={0}
                aria-label={`String ${string + 1}, Fret ${fret + 1}, Note ${note}`}
				>
					<circle
						cx={fretSpacing * (fret + 0.5)}
						cy={stringSpacing * (string + 1)}
						r={fretSpacing / 4}
                  fill={bg}
					/>
					{easyMode && (
						<text
							x={fretSpacing * (fret + 0.5)}
							y={stringSpacing * (string + 1) + 4}
							textAnchor="middle"
							fontSize="10"
							fontFamily="Arial"
                    fill={fg}
							style={{ pointerEvents: "none" }}
						>
							{note}
						</text>
					)}
				</g>
            )
          })}
				</g>
				<g>
          {tuning.map((note, i) => (
						<text
              key={`string-name-${i}`}
              x={20}
              y={stringSpacing * (i + 1) + 5}
							textAnchor="middle"
							fontSize="12"
							fontFamily="Arial"
							fill="black"
						>
							{note}
						</text>
					))}
				</g>
			</svg>
		</div>
  )
}
