"use client";

import React from "react";
import type { ChordSVGProps, Note } from "@/types/chord";

// Internal type for normalized notes with string position
type NormalizedNote = {
	stringIndex: number;
	fret: number;
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
	// Validate inputs
	if (fret === null || fret < 0) return "";
	if (stringIndex < 0 || stringIndex >= STRING_NOTES.length) {
		console.warn(`Invalid string index: ${stringIndex}`);
		return "";
	}

	// Open string
	if (fret === 0) return STRING_NOTES[stringIndex];

	// Calculate note based on fret position
	const fretArray = FRET_NOTES[stringIndex];
	if (!fretArray) {
		console.warn(`No fret notes for string ${stringIndex}`);
		return "";
	}

	// Use modulo to wrap around the chromatic scale
	const noteIndex = fret % 12;
	return fretArray[noteIndex] || "";
};

const normalizeChordData = (notes: Note[]): NormalizedNote[] => {
	return notes.map((note, stringIndex) => ({
		stringIndex,
		fret: note.fret ?? 0,
		finger: note.finger ?? 0,
	}));
};

const ChordDiagram = ({
						  notes,
						  chordName,
						  startingFret,
					  }: {
	notes: NormalizedNote[];
	chordName: string;
	startingFret: number;
}) => {
	// SVG dimensions
	const width = 300;
	const height = 400;
	const stringSpacing = width / 7;
	const fretSpacing = height / 6;
	const textMargin = 80;
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
		>
			<title id="chordTitle">{chordName} Guitar Chord Diagram</title>
			<desc id="chordDesc">
				A visual representation of the {chordName} guitar chord fingering
			</desc>

			{/* Chord name */}
			<text
				x="50%"
				y={textMargin / 2}
				textAnchor="middle"
				fontSize="24"
				fontFamily="Arial"
				fontWeight="bold"
				fill="black"
			>
				{chordName}
			</text>

			{/* String names */}
			{strings.map((_, i) => (
				<text
					key={`string-name-${i}`}
					x={stringSpacing * (i + 1) + leftMargin}
					y={textMargin}
					textAnchor="middle"
					fontSize="18"
					fontFamily="Arial"
					fill="black"
				>
					{stringNames[i]}
				</text>
			))}

			{/* String lines */}
			{strings.map((_, i) => (
				<line
					key={`string-${i}`}
					x1={stringSpacing * (i + 1) + leftMargin}
					y1={textMargin + topMargin}
					x2={stringSpacing * (i + 1) + leftMargin}
					y2={height + textMargin}
					stroke="black"
					strokeWidth="2"
				/>
			))}

			{/* Fret lines */}
			{frets.map((_, i) => (
				<line
					key={`fret-${i}`}
					x1={leftMargin + 20}
					y1={fretSpacing * i + textMargin + topMargin}
					x2={leftMargin + fretLineWidth + 20}
					y2={fretSpacing * i + textMargin + topMargin}
					stroke={i === 0 ? "black" : "gray"}
					strokeWidth={i === 0 ? "3" : "2"}
				/>
			))}

			{/* Fret numbers */}
			{frets.slice(1).map((_, i) => (
				<text
					key={`fret-number-${i}`}
					x={width + leftMargin + 10}
					y={fretSpacing * (i + 1) + textMargin + topMargin + fretSpacing / 2}
					textAnchor="middle"
					fontSize="16"
					fontFamily="Arial"
					fill="black"
				>
					{startingFret + i}
				</text>
			))}

			{/* Note markers and open/muted strings */}
			{notes.map((note) => {
				const { stringIndex, fret, finger } = note;

				if (fret === 0 || fret === null) {
					return (
						<text
							key={`open-${stringIndex}`}
							x={stringSpacing * (6 - stringIndex) + leftMargin}
							y={textMargin + topMargin - 10}
							textAnchor="middle"
							fontSize="20"
							fontFamily="Arial"
							fill="black"
						>
							{fret === 0 ? "O" : "X"}
						</text>
					);
				}

				const visualFret = fret - startingFret + 1;

				if (visualFret >= 1 && visualFret <= 5) {
					return (
						<g key={`note-${stringIndex}`}>
							<circle
								cx={stringSpacing * (6 - stringIndex) + leftMargin}
								cy={
									fretSpacing * visualFret +
									textMargin +
									topMargin -
									fretSpacing / 2
								}
								r={12}
								fill="blue"
							/>
							{finger > 0 && (
								<text
									x={stringSpacing * (6 - stringIndex) + leftMargin}
									y={
										fretSpacing * visualFret +
										textMargin +
										topMargin -
										fretSpacing / 2 +
										5
									}
									textAnchor="middle"
									fontSize="14"
									fontFamily="Arial"
									fill="white"
									fontWeight="bold"
								>
									{finger}
								</text>
							)}
						</g>
					);
				}

				return null;
			})}
		</svg>
	);
};

export const ChordSVG = ({
							 chord,
							 chordName,
							 startingFret,
						 }: ChordSVGProps) => {

	const normalizedNotes = normalizeChordData(chord);

	const noteNames = normalizedNotes
		.map((note) => getNoteName(note.stringIndex, note.fret))
		.filter(Boolean)

	return (
		<div className="mb-6">
			<div className="max-w-md mx-auto">
				<ChordDiagram
					notes={normalizedNotes}
					chordName={chordName}
					startingFret={startingFret}
				/>
			</div>
			<div className="mt-4 text-center">
				<strong className="block mb-2">Notes:</strong>
				<p className="text-lg">{noteNames.join(", ")}</p>
			</div>
		</div>
	);
};