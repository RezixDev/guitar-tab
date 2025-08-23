"use client";

import React from "react";
import { ChordSVGProps } from "@/types/chord";

type Note = {
	string: number;
	fret: number;
	finger: number;
}

const stringNotes = ["E2", "A2", "D3", "G3", "B3", "E4"];
const fretNotes = [
	["E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3"],
	["A2", "A#2", "B2", "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3"],
	["D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", "C4", "C#4"],
	["G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4"],
	["B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4"],
	["E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5", "C#5", "D5", "D#5"],
];

const getNote = (string: number, fret: number): string => {
	if (fret === 0) return stringNotes[string];
	const noteIndex =
		(fretNotes[string].indexOf(stringNotes[string]) + fret) % 12;
	return fretNotes[string][noteIndex];
};

const isNoteArray = (chord: Note[] | (number | null)[]): chord is Note[] => {
	return chord.length > 0 && typeof chord[0] === "object";
};

const normalizeChordData = (
	chord: Note[] | (number | null)[]
): Note[] => {
	if (isNoteArray(chord)) {
		return chord.map((note) => ({
			string: note.string,
			fret: note.fret,
			finger: note.finger,
		}));
	}

	return chord.map((fret, index) => ({
		string: index,
		fret: fret ?? 0,
		finger: 0,
	}));
};

const generateChordSVG = (
	chord: Note[],
	chordName: string,
	startingFret: number
) => {
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

			{strings.map((string, i) => (
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

			{strings.map((string, i) => (
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

			{frets.map((fret, i) => (
				<line
					key={`fret-${i}`}
					x1={leftMargin + 20}
					y1={fretSpacing * i + textMargin + topMargin}
					x2={leftMargin + fretLineWidth + 20}
					y2={fretSpacing * i + textMargin + topMargin}
					stroke="black"
					strokeWidth="2"
				/>
			))}

			{frets.map((fret, i) => (
				<text
					key={`fret-number-${i}`}
					x={width + leftMargin + 10}
					y={fretSpacing * i + textMargin + topMargin + fretSpacing / 2 + 3}
					textAnchor="middle"
					fontSize="16"
					fontFamily="Arial"
					fill="black"
				>
					{startingFret + i}
				</text>
			))}

			{chord.map(
				(note, i) =>
					note.fret > 0 && (
						<g key={`note-${i}`}>
							<circle
								cx={stringSpacing * (note.string + 1) + leftMargin}
								cy={
									fretSpacing * (note.fret - startingFret + 1) +
									textMargin +
									topMargin -
									fretSpacing / 2
								}
								r={12}
								fill="blue"
							/>
							<text
								x={stringSpacing * (note.string + 1) + leftMargin}
								y={
									fretSpacing * (note.fret - startingFret + 1) +
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
								{note.finger}
							</text>
						</g>
					)
			)}
		</svg>
	);
};

export const ChordSVG: React.FC<ChordSVGProps> = ({
	chord,
	chordName,
	startingFret,
}) => {
	const normalizedChord = normalizeChordData(chord);
	const chordNotes = normalizedChord
		.map((note) => getNote(note.string, note.fret + (startingFret - 1)))
		.reverse();

	return (
		<div className="mb-6">
			<div className="max-w-md mx-auto">
				{generateChordSVG(normalizedChord, chordName, startingFret)}
			</div>
			<div className="mt-4 text-center">
				<strong className="block mb-2">Notes:</strong>
				<p className="text-lg">{chordNotes.join(", ")}</p>
			</div>
		</div>
	);
};
