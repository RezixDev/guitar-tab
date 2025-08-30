"use client"

import { useMemo, useState, useCallback } from "react"
import { Tuning, Note, NotePosition, getNote } from "@/utils/noteUtils"

type FretboardSVGProps = {
  tuning: Tuning
  width: number
  height: number
  onFretClick: (stringIndex: number, fretIndex: number) => void
  showNext: boolean
  currentNote: Note
  guessedPositions: NotePosition[]
  highContrast?: boolean
  isFlipped: boolean
  isNewbieMode: boolean
  isEasyMode: boolean
}

const STRING_COUNT = 6
const FRET_COUNT = 12

const highContrastColors: Record<string, string> = {
		A: "#000000",
		"A#": "#1a1a1a",
		B: "#333333",
		C: "#4d4d4d",
		"C#": "#666666",
		D: "#808080",
		"D#": "#999999",
		E: "#b3b3b3",
		F: "#cccccc",
		"F#": "#e6e6e6",
		G: "#f2f2f2",
		"G#": "#ffffff",
}

const normalColors: Record<string, string> = {
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
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))
const luminance = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const a = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]
}
const fontOn = (bg: string) => (luminance(bg) > 0.5 ? "#000000" : "#FFFFFF")
const toDisplayIndex = (logicalIndex: number, flipped: boolean) =>
  flipped ? logicalIndex : STRING_COUNT - 1 - logicalIndex

export function FretboardSVG({
  tuning,
  width,
  height,
  onFretClick,
  showNext,
  currentNote,
  guessedPositions,
  highContrast = false,
  isFlipped,
  isNewbieMode,
  isEasyMode,
}: FretboardSVGProps) {
  const [focused, setFocused] = useState<{ string: number; fret: number }>({ string: 0, fret: 0 })

  const stringSpacing = height / (STRING_COUNT + 1)
  const fretSpacing = width / (FRET_COUNT + 1)
  const noteColors = useMemo(() => (highContrast ? highContrastColors : normalColors), [highContrast])

  const strings = useMemo(() => Array.from({ length: STRING_COUNT }, (_, i) => i), [])
  const frets = useMemo(() => Array.from({ length: FRET_COUNT }, (_, i) => i), [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<SVGSVGElement>) => {
      if (e.key === "ArrowUp") {
        setFocused((p) => ({ ...p, string: clamp(p.string - 1, 0, STRING_COUNT - 1) }))
        e.preventDefault()
      } else if (e.key === "ArrowDown") {
        setFocused((p) => ({ ...p, string: clamp(p.string + 1, 0, STRING_COUNT - 1) }))
        e.preventDefault()
      } else if (e.key === "ArrowLeft") {
        setFocused((p) => ({ ...p, fret: clamp(p.fret - 1, 0, FRET_COUNT - 1) }))
        e.preventDefault()
      } else if (e.key === "ArrowRight") {
        setFocused((p) => ({ ...p, fret: clamp(p.fret + 1, 0, FRET_COUNT - 1) }))
        e.preventDefault()
      } else if (e.key === "Enter" || e.key === " ") {
        onFretClick(focused.string, focused.fret)
        e.preventDefault()
		}
    },
    [focused.fret, focused.string, onFretClick]
  )

			return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      className={`border border-gray-400 rounded-lg ${highContrast ? "bg-black" : "bg-white"}`}
      tabIndex={0}
      role="application"
      aria-label="Guitar Fretboard"
      onKeyDown={handleKeyDown}
				>
      <g transform="translate(40, 0)">
        {strings.map((i) => (
			<line
				key={`string-${i}`}
				x1={0}
				y1={stringSpacing * (i + 1)}
				x2={width}
				y2={stringSpacing * (i + 1)}
				stroke={highContrast ? "white" : "black"}
            strokeWidth={2}
				role="presentation"
			/>
        ))}

        {Array.from({ length: FRET_COUNT + 1 }, (_, i) => (
			<line
				key={`fret-${i}`}
				x1={fretSpacing * i}
				y1={0}
				x2={fretSpacing * i}
				y2={height}
				stroke={highContrast ? "white" : "black"}
            strokeWidth={i === 0 ? 4 : 2}
				role="presentation"
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
				fill={highContrast ? "white" : "black"}
				role="presentation"
			>
				{i + 1}
			</text>
        ))}

        {strings.map((stringIndex) =>
          frets.map((fretIndex) => {
            const displayStringIndex = toDisplayIndex(stringIndex, isFlipped)
            const note = getNote(stringIndex, fretIndex, tuning)
            const showColor = isNewbieMode
            const bg = showColor ? noteColors[note] : "transparent"
				const isFocused =
              focused.string === stringIndex && focused.fret === fretIndex

				return (
					<g
						key={`fret-note-${stringIndex}-${fretIndex}`}
						onClick={() => onFretClick(stringIndex, fretIndex)}
                onFocus={() => setFocused({ string: stringIndex, fret: fretIndex })}
						style={{ cursor: "pointer" }}
						role="button"
						tabIndex={0}
						aria-label={`String ${stringIndex + 1}, Fret ${
							fretIndex + 1
						}, Note ${note}`}
					>
						<circle
							cx={fretSpacing * (fretIndex + 0.5)}
							cy={stringSpacing * (displayStringIndex + 1)}
							r={fretSpacing / 4}
                  fill={bg}
							className={isFocused ? "ring-2 ring-blue-500" : ""}
						/>
						{isEasyMode && note && (
							<text
								x={fretSpacing * (fretIndex + 0.5)}
								y={stringSpacing * (displayStringIndex + 1) + 4}
								textAnchor="middle"
								fontSize="10"
								fontFamily="Arial"
                    fill={fontOn(bg || "#ffffff")}
								style={{ pointerEvents: "none" }}
							>
								{note}
							</text>
						)}
					</g>
            )
			})
        )}

        {showNext && (
          (() => {
            const displayString = toDisplayIndex(currentNote.string, isFlipped)
		return (
			<>
				<circle
					cx={fretSpacing * (currentNote.fret + 0.5)}
                  cy={stringSpacing * (displayString + 1)}
					r={12}
					fill={highContrast ? "#ffffff" : "lightblue"}
                  stroke="black"
                  strokeWidth={1}
				/>
				<text
					x={fretSpacing * (currentNote.fret + 0.5)}
                  y={stringSpacing * (displayString + 1) + 4}
					textAnchor="middle"
					fontSize="10"
					fontFamily="Arial"
                  fill="black"
					style={{ pointerEvents: "none" }}
				>
					{currentNote.note}
				</text>
			</>
            )
          })()
        )}

        {guessedPositions.map(({ string, fret }) => {
          const displayString = toDisplayIndex(string, isFlipped)
			return (
            <g key={`guessed-${string}-${fret}`}>
					<circle
						cx={fretSpacing * (fret + 0.5)}
                cy={stringSpacing * (displayString + 1)}
						r={12}
						fill={highContrast ? "#ffffff" : "lightblue"}
                stroke="black"
                strokeWidth={1}
					/>
					<text
						x={fretSpacing * (fret + 0.5)}
                y={stringSpacing * (displayString + 1) + 4}
						textAnchor="middle"
						fontSize="10"
						fontFamily="Arial"
                fill="black"
					>
						{getNote(string, fret, tuning)}
					</text>
				</g>
          )
        })}
      </g>

      <g>
        {tuning.map((note, logicalIndex) => {
          const displayIndex = toDisplayIndex(logicalIndex, isFlipped)
	return (
					<text
              key={`string-name-${logicalIndex}`}
              x={20}
              y={stringSpacing * (displayIndex + 1) + 5}
						textAnchor="middle"
						fontSize="12"
						fontFamily="Arial"
						fill={highContrast ? "white" : "black"}
					>
						{note}
					</text>
          )
        })}
			</g>
		</svg>
  )
}
