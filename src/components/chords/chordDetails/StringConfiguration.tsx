import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Chord, Note } from "@/types/chord";

export type StringConfigurationProps = {
	chord: Chord;
	onNoteChange: (index: number, field: keyof Note, value: string) => void;
}

export function StringConfiguration({
	chord,
	onNoteChange,
}: StringConfigurationProps) {
	const strings = ["E", "A", "D", "G", "B", "e"] as const;
	const [activeFinger, setActiveFinger] = useState(1);
	const [lastActiveString, setLastActiveString] = useState<number | null>(null);
	const [windowStart, setWindowStart] = useState(0);
	const FRETS_IN_WINDOW = 8;
	const MAX_FRET = 24;

	// Handle finger button click - update the active finger and apply to highlighted string
	const handleFingerChange = (finger: number) => {
		setActiveFinger(finger);

		// If there's a highlighted string with a note on it, update its finger
		if (lastActiveString !== null) {
			const note = chord.notes[lastActiveString];
			if (note.fret !== null && note.fret > 0) {
				onNoteChange(lastActiveString, "finger", finger.toString());
			}
		}
	};

	const handleFretClick = (
		stringIndex: number,
		event: React.MouseEvent<HTMLDivElement>
	) => {
		const fretBar = event.currentTarget;
		const rect = fretBar.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const width = rect.width;

		const relativePosition = Math.round((x / width) * (FRETS_IN_WINDOW - 1));
		const absoluteFret = windowStart + relativePosition;

		onNoteChange(stringIndex, "fret", absoluteFret.toString());
		onNoteChange(stringIndex, "finger", activeFinger.toString());
		setLastActiveString(stringIndex);
	};

	const handleTouchMove = (
		stringIndex: number,
		event: React.TouchEvent<HTMLDivElement>
	) => {
		event.preventDefault();
		const touch = event.touches[0];
		const fretBar = event.currentTarget;
		const rect = fretBar.getBoundingClientRect();
		const x = touch.clientX - rect.left;
		const width = rect.width;

		const relativePosition = Math.round((x / width) * (FRETS_IN_WINDOW - 1));
		const absoluteFret = windowStart + relativePosition;

		if (absoluteFret >= 0 && absoluteFret <= MAX_FRET) {
			onNoteChange(stringIndex, "fret", absoluteFret.toString());
			onNoteChange(stringIndex, "finger", activeFinger.toString());
			setLastActiveString(stringIndex);
		}
	};

	const shiftWindow = (direction: "left" | "right") => {
		const shift = direction === "left" ? -FRETS_IN_WINDOW : FRETS_IN_WINDOW;
		const newStart = Math.max(
			0,
			Math.min(MAX_FRET - FRETS_IN_WINDOW, windowStart + shift)
		);
		setWindowStart(newStart);
	};

	const getPositionInWindow = (fret: number | null): number => {
		if (
			fret === null ||
			fret < windowStart ||
			fret > windowStart + FRETS_IN_WINDOW
		)
			return -1;
		return ((fret - windowStart) / (FRETS_IN_WINDOW - 1)) * 100;
	};

	return (
		<TooltipProvider>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold">String Configuration</h3>
					<div className="flex space-x-2 items-center">
						<span className="text-sm text-gray-500">Finger:</span>
						<div className="flex space-x-1">
							{[1, 2, 3, 4].map((finger) => (
								<button
									key={finger}
									onClick={() => handleFingerChange(finger)} // Use the new handler
									className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                    ${
											activeFinger === finger
												? "bg-blue-500 text-white border-blue-600"
												: "bg-gray-100 border-gray-300 hover:bg-gray-200"
										}`}
								>
									{finger}
								</button>
							))}
						</div>
					</div>
				</div>

				<Card className="p-6">
					<CardContent className="p-0">
						<div className="flex items-center justify-between mb-4">
							<Button
								variant="outline"
								size="sm"
								onClick={() => shiftWindow("left")}
								disabled={windowStart === 0}
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<span className="text-sm font-medium">
								Frets {windowStart} - {windowStart + FRETS_IN_WINDOW - 1}
							</span>
							<Button
								variant="outline"
								size="sm"
								onClick={() => shiftWindow("right")}
								disabled={windowStart >= MAX_FRET - FRETS_IN_WINDOW}
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>

						<div className="flex flex-col space-y-8">
							{chord.notes.map((note, index) => (
								<div
									key={`string-${index}`}
									className={`flex items-center space-x-4 p-2 rounded-lg transition-colors ${
										lastActiveString === index 
											? "bg-blue-50 dark:bg-blue-950/30 ring-2 ring-blue-500/20" 
											: ""
									}`}
								>
									<Tooltip>
										<TooltipTrigger>
											<div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
												lastActiveString === index
													? "bg-blue-500 text-white"
													: "bg-gray-200 dark:bg-gray-700"
											}`}>
												{strings[index]}
											</div>
										</TooltipTrigger>
										<TooltipContent>
											String {6 - index} ({strings[index]})
										</TooltipContent>
									</Tooltip>

									<div className="flex-1 relative h-12 group">
										<div
											className="absolute top-1/2 w-full h-8 -translate-y-1/2 cursor-pointer"
											onClick={(e) => handleFretClick(index, e)}
											onTouchMove={(e) => handleTouchMove(index, e)}
											onTouchStart={(e) => e.preventDefault()}
										>
											{/* Fret markers */}
											<div className="w-full h-1 bg-gray-300 dark:bg-gray-600">
												{Array.from({ length: FRETS_IN_WINDOW }, (_, i) => (
													<div
														key={i}
														className="absolute h-3 w-0.5 bg-gray-400 dark:bg-gray-500"
														style={{
															left: `${(i / (FRETS_IN_WINDOW - 1)) * 100}%`,
														}}
													>
														<span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs">
															{windowStart + i}
														</span>
													</div>
												))}
											</div>

											{/* Note marker */}
											{note.fret !== null &&
												note.fret >= windowStart &&
												note.fret < windowStart + FRETS_IN_WINDOW && (
													<div
														className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-blue-500 shadow-lg transition-all"
														style={{
															left: `${getPositionInWindow(note.fret)}%`,  // note.fret
															transform: "translate(-50%, -50%)",
														}}
													>
									<span className="absolute inset-0 flex items-center justify-center text-white text-sm">
										{note.finger || activeFinger}
									</span>
													</div>
												)}
										</div>
									</div>

									<Tooltip>
										<TooltipTrigger>
											<Input
												type="number"
												value={note.fret ?? ""}
												onChange={(e) => {
													onNoteChange(index, "fret", e.target.value);
													if (parseInt(e.target.value) > 0) {
														onNoteChange(
															index,
															"finger",
															activeFinger.toString()
														);
													}
													setLastActiveString(index);
												}}
												onFocus={() => setLastActiveString(index)}
												className="w-16 text-center"
												min="0"
												max={MAX_FRET}
												placeholder="-"
											/>
										</TooltipTrigger>
										<TooltipContent>Fret number</TooltipContent>
									</Tooltip>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</TooltipProvider>
	);
}
