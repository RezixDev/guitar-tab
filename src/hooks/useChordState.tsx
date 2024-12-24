"use client";
import { useState, ChangeEvent } from "react";
import { standardChords, extendedChords } from "@/data/chords";
import type { Chord, Note } from "@/components/chords/types";

export function useChordState() {
	const [currentChord, setCurrentChord] = useState<Chord>(
		standardChords.length > 0
			? standardChords[0]
			: { name: "", startingFret: 1, notes: [] }
	);
	const [searchTerm, setSearchTerm] = useState("");

	const handleChordChange = (chord: Chord) => {
		setCurrentChord(chord);
	};

	const handleInputChange = (
		index: number,
		field: keyof Note,
		value: string
	) => {
		setCurrentChord((prev) => ({
			...prev,
			notes: prev.notes.map((note, i) =>
				i === index ? { ...note, [field]: parseInt(value, 10) } : note
			),
		}));
	};

	const handleNameChange = (value: string) => {
		setCurrentChord((prev) => ({ ...prev, name: value }));
	};

	const handleStartingFretChange = (value: string) => {
		setCurrentChord((prev) => ({ ...prev, startingFret: parseInt(value, 10) }));
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
