import React, { useRef, useEffect } from "react";
import { Tuning, Note, NotePosition, getNote } from "../../app/utils/noteUtils";

interface FretboardSVGProps {
	tuning: Tuning;
	width: number;
	height: number;
	onFretClick: (string: number, fret: number) => void;
	showNext: boolean;
	currentNote: Note;
	guessedPositions: NotePosition[];
	easyMode: boolean;
	highContrast?: boolean; // New prop for high contrast mode
}

const FretboardSVG: React.FC<FretboardSVGProps> = ({
	tuning,
	width,
	height,
	onFretClick,
	showNext,
	currentNote,
	guessedPositions,
	easyMode,
	highContrast = false,
}) => {
	const fretboardRef = useRef<SVGSVGElement>(null);
	const [focusedPosition, setFocusedPosition] = React.useState<{
		string: number;
		fret: number;
	}>({ string: 0, fret: 0 });

	const stringCount = 6;
	const fretCount = 12;
	const stringSpacing = height / (stringCount + 1);
	const fretSpacing = width / (fretCount + 1);

	// High contrast color scheme
	const highContrastColors: { [key: string]: string } = {
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
	};

	// Regular color scheme
	const normalColors: { [key: string]: string } = {
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
	};

	const noteColors = highContrast ? highContrastColors : normalColors;

	const getLuminance = (hexColor: string): number => {
		if (!hexColor) return 0; // Return default if no color provided

		try {
			const r = parseInt(hexColor.slice(1, 3), 16) / 255;
			const g = parseInt(hexColor.slice(3, 5), 16) / 255;
			const b = parseInt(hexColor.slice(5, 7), 16) / 255;

			const a = [r, g, b].map((v) =>
				v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
			);

			return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
		} catch (error) {
			return 0; // Return default on error
		}
	};

	const getFontColor = (hexColor: string): string =>
		getLuminance(hexColor) > 0.5 ? "#000000" : "#FFFFFF";

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			switch (e.key) {
				case "ArrowUp":
					setFocusedPosition((prev) => ({
						...prev,
						string: Math.max(0, prev.string - 1),
					}));
					e.preventDefault();
					break;
				case "ArrowDown":
					setFocusedPosition((prev) => ({
						...prev,
						string: Math.min(stringCount - 1, prev.string + 1),
					}));
					e.preventDefault();
					break;
				case "ArrowLeft":
					setFocusedPosition((prev) => ({
						...prev,
						fret: Math.max(0, prev.fret - 1),
					}));
					e.preventDefault();
					break;
				case "ArrowRight":
					setFocusedPosition((prev) => ({
						...prev,
						fret: Math.min(fretCount - 1, prev.fret + 1),
					}));
					e.preventDefault();
					break;
				case "Enter":
				case " ":
					onFretClick(focusedPosition.string, focusedPosition.fret);
					e.preventDefault();
					break;
			}
		};

		const fretboard = fretboardRef.current;
		if (fretboard) {
			fretboard.addEventListener("keydown", handleKeyDown);
		}

		return () => {
			if (fretboard) {
				fretboard.removeEventListener("keydown", handleKeyDown);
			}
		};
	}, [focusedPosition, onFretClick, stringCount, fretCount]);

	const renderStrings = () =>
		[...Array(stringCount)].map((_, i) => (
			<line
				key={`string-${i}`}
				x1={0}
				y1={stringSpacing * (i + 1)}
				x2={width}
				y2={stringSpacing * (i + 1)}
				stroke={highContrast ? "white" : "black"}
				strokeWidth="2"
				role="presentation"
			/>
		));

	const renderFrets = () =>
		[...Array(fretCount + 1)].map((_, i) => (
			<line
				key={`fret-${i}`}
				x1={fretSpacing * i}
				y1={0}
				x2={fretSpacing * i}
				y2={height}
				stroke={highContrast ? "white" : "black"}
				strokeWidth={i === 0 ? "4" : "2"}
				role="presentation"
			/>
		));

	const renderFretNumbers = () =>
		[...Array(fretCount)].map((_, i) => (
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
		));

// In FretboardSVG component
const renderClickableAreas = () =>
  [...Array(stringCount)].map((_, stringIndex) =>
    [...Array(fretCount)].map((_, fretIndex) => {
      const note = getNote(stringIndex, fretIndex, tuning);
      const backgroundColor = easyMode && note ? noteColors[note] : "transparent";
      const fontColor = backgroundColor ? getFontColor(backgroundColor) : "#000000";
      const isFocused =
        focusedPosition.string === stringIndex &&
        focusedPosition.fret === fretIndex;

      return (
        <g
          key={`fret-note-${stringIndex}-${fretIndex}`}
          onClick={() => onFretClick(stringIndex, fretIndex)}
          onFocus={() =>
            setFocusedPosition({ string: stringIndex, fret: fretIndex })
          }
          style={{ cursor: "pointer" }}
          role="button"
          tabIndex={0}
          aria-label={`String ${stringIndex + 1}, Fret ${
            fretIndex + 1
          }, Note ${note}`}
        >
          <circle
            cx={fretSpacing * (fretIndex + 0.5)}
            cy={stringSpacing * (stringIndex + 1)}
            r={fretSpacing / 4}
            fill={backgroundColor || "transparent"}
            className={isFocused ? "ring-2 ring-blue-500" : ""}
          />
          {easyMode && note && (
            <text
              x={fretSpacing * (fretIndex + 0.5)}
              y={stringSpacing * (stringIndex + 1) + 4}
              textAnchor="middle"
              fontSize="10"
              fontFamily="Arial"
              fill={fontColor}
              style={{ pointerEvents: "none" }}
            >
              {note}
            </text>
          )}
          {isFocused && (
            <circle
              cx={fretSpacing * (fretIndex + 0.5)}
              cy={stringSpacing * (stringIndex + 1)}
              r={fretSpacing / 3}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4"
              className="focus-indicator"
            />
          )}
        </g>
      );
    })
  );

	const renderCurrentNote = () => (
		<>
			<circle
				cx={fretSpacing * (currentNote.fret + 0.5)} // Changed from (currentNote.fret + 1) - fretSpacing / 2
				cy={stringSpacing * (currentNote.string + 1)}
				r={12}
				fill={highContrast ? "#ffffff" : "lightblue"}
				stroke={highContrast ? "black" : "black"}
				strokeWidth="1"
			/>
			<text
				x={fretSpacing * (currentNote.fret + 0.5)} // Changed from (currentNote.fret + 1) - fretSpacing / 2
				y={stringSpacing * (currentNote.string + 1) + 4}
				textAnchor="middle"
				fontSize="10"
				fontFamily="Arial"
				fill={highContrast ? "black" : "black"}
			>
				{currentNote.note}
			</text>
		</>
	);

	const renderGuessedNotes = () =>
		guessedPositions.map(({ string, fret }) => (
			<g key={`guessed-note-${string}-${fret}`}>
				<circle
					cx={fretSpacing * (fret + 0.5)}
					cy={stringSpacing * (string + 1)}
					r={12}
					fill={highContrast ? "#ffffff" : "lightblue"}
					stroke={highContrast ? "black" : "black"}
					strokeWidth="1"
				/>
				<text
					x={fretSpacing * (fret + 0.5)}
					y={stringSpacing * (string + 1) + 4}
					textAnchor="middle"
					fontSize="10"
					fontFamily="Arial"
					fill={highContrast ? "black" : "black"}
				>
					{getNote(string, fret, tuning)}
				</text>
			</g>
		));

	return (
		<svg
			ref={fretboardRef}
			width="100%"
			height="100%"
			viewBox={`0 0 ${width} ${height}`}
			preserveAspectRatio="xMidYMid meet"
			xmlns="http://www.w3.org/2000/svg"
			className={`border border-gray-400 rounded-lg ${
				highContrast ? "bg-black" : "bg-white"
			}`}
			tabIndex={0}
			role="application"
			aria-label="Guitar Fretboard"
		>
			<g transform={`translate(40, 0)`}>
				{renderStrings()}
				{renderFrets()}
				{renderFretNumbers()}
				{renderClickableAreas()}
				{showNext && renderCurrentNote()}
				{renderGuessedNotes()}
			</g>
			<g>
				{tuning.map((note, index) => (
					<text
						key={`string-name-${index}`}
						x="20"
						y={stringSpacing * (index + 1) + 5}
						textAnchor="middle"
						fontSize="12"
						fontFamily="Arial"
						fill={highContrast ? "white" : "black"}
					>
						{note}
					</text>
				))}
			</g>
		</svg>
	);
};

export default FretboardSVG;
