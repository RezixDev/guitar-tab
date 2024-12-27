// src/data/chords.tsx
interface Chord {
	name: string;
	startingFret: number;
	notes: {
		string: number;
		fret: number;
		finger: number;
	}[];
}

export const standardChords: Chord[] = [
	{
		name: "A Major",
		startingFret: 1,
		notes: [
			{ string: 5, fret: 0, finger: 0 },
			{ string: 4, fret: 2, finger: 1 },
			{ string: 3, fret: 2, finger: 2 },
			{ string: 2, fret: 2, finger: 3 },
			{ string: 1, fret: 0, finger: 0 },
			{ string: 0, fret: 0, finger: 0 },
		],
	},
	{
		name: "A Minor",
		startingFret: 1,
		notes: [
			{ string: 5, fret: 0, finger: 0 },
			{ string: 4, fret: 1, finger: 1 },
			{ string: 3, fret: 2, finger: 3 },
			{ string: 2, fret: 2, finger: 2 },
			{ string: 1, fret: 0, finger: 0 },
			{ string: 0, fret: 0, finger: 0 },
		],
	},
	{
		name: "C Major",
		startingFret: 1,
		notes: [
			{ string: 5, fret: 0, finger: 0 },
			{ string: 4, fret: 1, finger: 1 },
			{ string: 3, fret: 0, finger: 0 },
			{ string: 2, fret: 2, finger: 2 },
			{ string: 1, fret: 3, finger: 3 },
			{ string: 0, fret: 0, finger: 0 },
		],
	},
	{
		name: "D Major",
		startingFret: 1,
		notes: [
			{ string: 5, fret: 2, finger: 2 },
			{ string: 4, fret: 3, finger: 3 },
			{ string: 3, fret: 2, finger: 1 },
			{ string: 2, fret: 0, finger: 0 },
			{ string: 1, fret: 0, finger: 0 },
			{ string: 0, fret: 0, finger: 0 },
		],
	},
	{
		name: "D Minor",
		startingFret: 1,
		notes: [
			{ string: 5, fret: 1, finger: 1 },
			{ string: 4, fret: 3, finger: 3 },
			{ string: 3, fret: 2, finger: 2 },
			{ string: 2, fret: 0, finger: 0 },
			{ string: 1, fret: 0, finger: 0 },
			{ string: 0, fret: 0, finger: 0 },
		],
	},
	{
		name: "E Major",
		startingFret: 1,
		notes: [
			{ string: 5, fret: 0, finger: 0 },
			{ string: 4, fret: 0, finger: 0 },
			{ string: 3, fret: 1, finger: 1 },
			{ string: 2, fret: 2, finger: 3 },
			{ string: 1, fret: 2, finger: 2 },
			{ string: 0, fret: 0, finger: 0 },
		],
	},
	{
		name: "E Minor",
		startingFret: 1,
		notes: [
			{ string: 5, fret: 0, finger: 0 },
			{ string: 4, fret: 0, finger: 0 },
			{ string: 3, fret: 0, finger: 0 },
			{ string: 2, fret: 2, finger: 2 },
			{ string: 1, fret: 2, finger: 3 },
			{ string: 0, fret: 0, finger: 0 },
		],
	},
	{
		name: "G Major",
		startingFret: 1,
		notes: [
			{ string: 5, fret: 3, finger: 4 },
			{ string: 4, fret: 2, finger: 2 },
			{ string: 3, fret: 0, finger: 0 },
			{ string: 2, fret: 0, finger: 0 },
			{ string: 1, fret: 0, finger: 0 },
			{ string: 0, fret: 3, finger: 3 },
		],
	},
	{
		name: "B Major",
		startingFret: 2,
		notes: [
			{ string: 5, fret: 2, finger: 1 },
			{ string: 4, fret: 4, finger: 3 },
			{ string: 3, fret: 4, finger: 4 },
			{ string: 2, fret: 4, finger: 5 },
			{ string: 1, fret: 3, finger: 2 },
			{ string: 0, fret: 2, finger: 1 },
		],
	},
	{
		name: "B Minor",
		startingFret: 2,
		notes: [
			{ string: 5, fret: 2, finger: 1 },
			{ string: 4, fret: 3, finger: 2 },
			{ string: 3, fret: 4, finger: 4 },
			{ string: 2, fret: 4, finger: 5 },
			{ string: 1, fret: 2, finger: 1 },
			{ string: 0, fret: 2, finger: 1 },
		],
	},
	{
		name: "F Major",
		startingFret: 1,
		notes: [
			{ string: 5, fret: 1, finger: 1 },
			{ string: 4, fret: 2, finger: 2 },
			{ string: 3, fret: 2, finger: 3 },
			{ string: 2, fret: 1, finger: 1 },
			{ string: 1, fret: 1, finger: 1 },
			{ string: 0, fret: 1, finger: 1 },
		],
	},
	{
		name: "F Minor",
		startingFret: 1,
		notes: [
			{ string: 5, fret: 1, finger: 1 },
			{ string: 4, fret: 3, finger: 3 },
			{ string: 3, fret: 3, finger: 4 },
			{ string: 2, fret: 1, finger: 1 },
			{ string: 1, fret: 1, finger: 1 },
			{ string: 0, fret: 1, finger: 1 },
		],
	},
];

export const extendedChords: Chord[] = [
	{
		name: "A7",
		startingFret: 1,
		notes: [
			{ string: 5, fret: 0, finger: 0 },
			{ string: 4, fret: 2, finger: 2 },
			{ string: 3, fret: 0, finger: 0 },
			{ string: 2, fret: 2, finger: 1 },
			{ string: 1, fret: 0, finger: 0 },
			{ string: 0, fret: 0, finger: 0 },
		],
	},
	{
		name: "D7",
		startingFret: 1,
		notes: [
			{ string: 5, fret: 2, finger: 2 },
			{ string: 4, fret: 1, finger: 1 },
			{ string: 3, fret: 2, finger: 3 },
			{ string: 2, fret: 0, finger: 0 },
			{ string: 1, fret: 0, finger: 0 },
			{ string: 0, fret: 0, finger: 0 },
		],
	},
	{
		name: "E7",
		startingFret: 1,
		notes: [
			{ string: 5, fret: 0, finger: 0 },
			{ string: 4, fret: 0, finger: 0 },
			{ string: 3, fret: 1, finger: 1 },
			{ string: 2, fret: 0, finger: 0 },
			{ string: 1, fret: 2, finger: 2 },
			{ string: 0, fret: 0, finger: 0 },
		],
	},
	{
		name: "G7",
		startingFret: 1,
		notes: [
			{ string: 5, fret: 3, finger: 4 },
			{ string: 4, fret: 2, finger: 2 },
			{ string: 3, fret: 0, finger: 0 },
			{ string: 2, fret: 0, finger: 0 },
			{ string: 1, fret: 0, finger: 0 },
			{ string: 0, fret: 1, finger: 1 },
		],
	},
	{
		name: "C7",
		startingFret: 1,
		notes: [
			{ string: 5, fret: 3, finger: 4 },
			{ string: 4, fret: 2, finger: 2 },
			{ string: 3, fret: 3, finger: 3 },
			{ string: 2, fret: 1, finger: 1 },
			{ string: 1, fret: 0, finger: 0 },
			{ string: 0, fret: 0, finger: 0 },
		],
	},
	{
		name: "A Major 7",
		startingFret: 1,
		notes: [
			{ string: 5, fret: 0, finger: 0 },
			{ string: 4, fret: 2, finger: 1 },
			{ string: 3, fret: 1, finger: 2 },
			{ string: 2, fret: 2, finger: 3 },
			{ string: 1, fret: 0, finger: 0 },
			{ string: 0, fret: 0, finger: 0 },
		],
	},
	{
		name: "C Major 7",
		startingFret: 1,
		notes: [
			{ string: 5, fret: 3, finger: 3 },
			{ string: 4, fret: 2, finger: 2 },
			{ string: 3, fret: 0, finger: 0 },
			{ string: 2, fret: 0, finger: 0 },
			{ string: 1, fret: 0, finger: 0 },
			{ string: 0, fret: 0, finger: 0 },
		],
	},
	{
		name: "D Major 7",
		startingFret: 1,
		notes: [
			{ string: 5, fret: 2, finger: 1 },
			{ string: 4, fret: 2, finger: 2 },
			{ string: 3, fret: 2, finger: 3 },
			{ string: 2, fret: 0, finger: 0 },
			{ string: 1, fret: 0, finger: 0 },
			{ string: 0, fret: 0, finger: 0 },
		],
	},
	{
		name: "G Major 7",
		startingFret: 1,
		notes: [
			{ string: 5, fret: 2, finger: 2 },
			{ string: 4, fret: 2, finger: 3 },
			{ string: 3, fret: 0, finger: 0 },
			{ string: 2, fret: 0, finger: 0 },
			{ string: 1, fret: 0, finger: 0 },
			{ string: 0, fret: 2, finger: 1 },
		],
	},
	{
		name: "B7",
		startingFret: 2,
		notes: [
			{ string: 5, fret: 2, finger: 1 },
			{ string: 4, fret: 1, finger: 2 },
			{ string: 3, fret: 2, finger: 3 },
			{ string: 2, fret: 0, finger: 0 },
			{ string: 1, fret: 2, finger: 4 },
			{ string: 0, fret: 0, finger: 0 },
		],
	},
	{
		name: "F7",
		startingFret: 1,
		notes: [
			{ string: 5, fret: 1, finger: 1 },
			{ string: 4, fret: 3, finger: 3 },
			{ string: 3, fret: 1, finger: 1 },
			{ string: 2, fret: 2, finger: 2 },
			{ string: 1, fret: 1, finger: 1 },
			{ string: 0, fret: 1, finger: 1 },
		],
	},
];

export const chords = [...standardChords, ...extendedChords];
