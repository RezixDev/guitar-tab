"use client";
import { useState, ChangeEvent } from "react";
import { standardChords, extendedChords } from "@/data/chords";
import type { Chord } from "@/types/chord";

const DEFAULT_CHORD: Chord = {
	name: "",
	notes: Array(6).fill(null).map(() => ({ fret: null, finger: null })),
	startingFret: 1,
};

export function useChordState(initialChord?: Chord) {
	const [currentChord, setCurrentChord] = useState<Chord>(
		initialChord || DEFAULT_CHORD  // ✅ No conversion needed!
	);
	const [searchTerm, setSearchTerm] = useState("");

const handleInputChange = (index: number, fret: number | null, finger: number | null = null) => {
		setCurrentChord((prev) => ({
			...prev,
        notes: prev.notes.map((note, i) =>
            i === index
                ? { fret, finger }
                : note
        ),
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
		setCurrentChord(chord);
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
