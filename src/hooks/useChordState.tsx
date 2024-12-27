"use client";
import { useState, ChangeEvent } from "react";
import { standardChords, extendedChords } from "@/data/chords";
import type { Chord, ChordState } from "@/types/chord";

const DEFAULT_CHORD: ChordState = {
	name: "",
	notes: Array(6).fill(null),
	startingFret: 1,
};

export function useChordState(initialChord?: Chord) {
	const [currentChord, setCurrentChord] = useState<ChordState>(
		initialChord ? convertChordToState(initialChord) : DEFAULT_CHORD
	);
	const [searchTerm, setSearchTerm] = useState("");

	function convertChordToState(chord: Chord): ChordState {
		return {
			name: chord.name,
			notes: chord.notes.map((note) => note.fret),
			startingFret: chord.startingFret,
		};
	}

	const handleInputChange = (index: number, value: number | null) => {
		setCurrentChord((prev) => ({
			...prev,
			notes: prev.notes.map((note, i) => (i === index ? value : note)),
		}));
	};

	const handleStartingFretChange = (value: string) => {
		const fret = parseInt(value, 10);
		if (!isNaN(fret)) {
			setCurrentChord((prev) => ({
				...prev,
				startingFret: fret,
			}));
		}
	};

	const handleChordChange = (chord: Chord) => {
		setCurrentChord(convertChordToState(chord));
	};

	const handleNameChange = (name: string) => {
		setCurrentChord((prev) => ({ ...prev, name }));
	};

	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const filteredStandardChords = standardChords.filter((chord) =>
		chord.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const filteredExtendedChords = extendedChords.filter((chord) =>
		chord.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return {
		currentChord,
		searchTerm,
		filteredStandardChords,
		filteredExtendedChords,
		handleChordChange,
		handleInputChange,
		handleNameChange,
		handleStartingFretChange,
		handleSearchChange,
	};
}
