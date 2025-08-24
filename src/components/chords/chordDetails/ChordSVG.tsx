"use client";

import React from "react";
import type { ChordSVGProps, Note, ChordTheme } from "@/types/chord";
import { chordThemes } from "@/types/chord";

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
	if (fret === null || fret < 0) return "";
	if (stringIndex < 0 || stringIndex >= STRING_NOTES.length) {
		console.warn(`Invalid string index: ${stringIndex}`);
		return "";
	}

	if (fret === 0) return STRING_NOTES[stringIndex];

	const fretArray = FRET_NOTES[stringIndex];
	if (!fretArray) {
		console.warn(`No fret notes for string ${stringIndex}`);
		return "";
	}

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

const renderMarker = (
	cx: number,
	cy: number,
	theme: ChordTheme,
	finger: number,
	key: string
) => {
	const size = 12;

	switch (theme.markerStyle) {
		case 'square':
			return (
				<g key={key}>
					<rect
						x={cx - size}
						y={cy - size}
						width={size * 2}
						height={size * 2}
						fill={theme.markerColor}
						stroke={theme.shadow ? "rgba(0,0,0,0.2)" : "none"}
						strokeWidth={theme.shadow ? 2 : 0}
					/>
					{theme.showFingerNumbers && finger > 0 && (
						<text
							x={cx}
							y={cy + 5}
							textAnchor="middle"
							fontSize="14"
							fontFamily={theme.fontFamily}
							fill={theme.markerTextColor}
							fontWeight="bold"
						>
							{finger}
						</text>
					)}
				</g>
			);
		case 'diamond':
			return (
				<g key={key}>
					<path
						d={`M ${cx} ${cy - size} L ${cx + size} ${cy} L ${cx} ${cy + size} L ${cx - size} ${cy} Z`}
						fill={theme.markerColor}
						stroke={theme.shadow ? "rgba(0,0,0,0.2)" : "none"}
						strokeWidth={theme.shadow ? 2 : 0}
					/>
					{theme.showFingerNumbers && finger > 0 && (
						<text
							x={cx}
							y={cy + 5}
							textAnchor="middle"
							fontSize="14"
							fontFamily={theme.fontFamily}
							fill={theme.markerTextColor}
							fontWeight="bold"
						>
							{finger}
						</text>
					)}
				</g>
			);
		default: // circle
			return (
				<g key={key}>
					<circle
						cx={cx}
						cy={cy}
						r={size}
						fill={theme.markerColor}
						stroke={theme.shadow ? "rgba(0,0,0,0.2)" : "none"}
						strokeWidth={theme.shadow ? 2 : 0}
					/>
					{theme.showFingerNumbers && finger > 0 && (
						<text
							x={cx}
							y={cy + 5}
							textAnchor="middle"
							fontSize="14"
							fontFamily={theme.fontFamily}
							fill={theme.markerTextColor}
							fontWeight="bold"
						>
							{finger}
						</text>
					)}
				</g>
			);
	}
};

const ChordDiagram = ({
						  notes,
						  chordName,
						  startingFret,
	theme,
					  }: {
	notes: NormalizedNote[];
	chordName: string;
	startingFret: number;
	theme: ChordTheme;
}) => {
	// SVG dimensions
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
			<desc id="chordDesc">
				A visual representation of the {chordName} guitar chord fingering
			</desc>

			{/* Chord name */}
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

			{/* String names */}
			{theme.showStringNames && strings.map((_, i) => (
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

			{/* String lines */}
			{strings.map((_, i) => (
				<line
					key={`string-${i}`}
					x1={stringSpacing * (i + 1) + leftMargin}
					y1={textMargin + topMargin}
					x2={stringSpacing * (i + 1) + leftMargin}
					y2={height + textMargin  - 100}
					stroke={theme.stringColor}
					strokeWidth="1"
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
					stroke={i === 0 ? theme.nutColor : theme.fretColor}
					strokeWidth={i === 0 ? "3" : "2"}
				/>
			))}

			{/* Fret numbers */}
			{theme.showFretNumbers && frets.slice(1).map((_, i) => (
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

			{/* Note markers and open/muted strings */}
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
};

export const ChordSVG = ({
							 chord,
							 chordName,
							 startingFret,
	theme = chordThemes.classic, // Default to classic theme
						 }: ChordSVGProps) => {

	const normalizedNotes = normalizeChordData(chord);

	const noteNames = normalizedNotes
		.map((note) => getNoteName(note.stringIndex, note.fret))
		.filter(Boolean);

	return (
		<div className="mb-6" style={{ backgroundColor: theme.backgroundColor, padding: '1rem', borderRadius: '0.5rem' }}>
			<div className="max-w-md mx-auto">
				<ChordDiagram
					notes={normalizedNotes}
					chordName={chordName}
					startingFret={startingFret}
					theme={theme}
				/>
			</div>
			{theme.showStringNames && (
				<div className="mt-4 text-center" style={{ color: theme.textColor }}>
					<strong className="block mb-2" style={{ fontFamily: theme.fontFamily }}>Notes:</strong>
					<p className="text-lg" style={{ fontFamily: theme.fontFamily }}>{noteNames.join(", ")}</p>
			</div>
			)}
		</div>
	);
};