import { useState } from "react";
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
import type { Note, Chord } from "@/types/chord"; // Import from types file

type StringConfigurationProps = {
	chord: Chord;
	onNoteChange: (index: number, field: keyof Note, value: string) => void;
};

const STRINGS = ["e", "B", "G", "D", "A", "E"] as const;
const FRETS_IN_WINDOW = 8;
const MAX_FRET = 24;
const FINGER_OPTIONS = [1, 2, 3, 4] as const;

export const StringConfiguration = ({
										chord,
										onNoteChange,
									}: StringConfigurationProps) => {
	const [activeFinger, setActiveFinger] = useState(1);
	const [lastActiveString, setLastActiveString] = useState<number | null>(null);
	const [windowStart, setWindowStart] = useState(0);

	const handleFingerChange = (finger: number) => {
		setActiveFinger(finger);
		if (lastActiveString !== null) {
			const note = chord.notes[lastActiveString];
			if (note.fret !== null && note.fret > 0) {
				onNoteChange(lastActiveString, "finger", finger.toString());
			}
		}
	};

	const handleFretClick = (stringIndex: number, event: React.MouseEvent<HTMLDivElement>) => {
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

	const handleTouchMove = (stringIndex: number, event: React.TouchEvent<HTMLDivElement>) => {
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
		if (fret === null || fret < windowStart || fret > windowStart + FRETS_IN_WINDOW) {
			return -1;
		}
		return ((fret - windowStart) / (FRETS_IN_WINDOW - 1)) * 100;
	};

	const handleMute = (index: number) => {
		onNoteChange(index, "fret", "");
		onNoteChange(index, "finger", "");
		setLastActiveString(index);
	};

	const handleOpen = (index: number) => {
		onNoteChange(index, "fret", "0");
		onNoteChange(index, "finger", "");
		setLastActiveString(index);
	};

	const handleFretInputChange = (index: number, value: string) => {
		onNoteChange(index, "fret", value);

		if (value !== "" && parseInt(value) > 0) {
			onNoteChange(index, "finger", activeFinger.toString());
		}

		if (value === "" || value === "0") {
			onNoteChange(index, "finger", "");
		}

		setLastActiveString(index);
	};

	const isStringActive = (index: number) => lastActiveString === index;
	const isFingerActive = (finger: number) => activeFinger === finger;
	const isFretInWindow = (fret: number | null) =>
		fret !== null && fret >= windowStart && fret < windowStart + FRETS_IN_WINDOW;

	return (
		<TooltipProvider>
			<div className="space-y-6">
				{/* Header with finger selection */}
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold">String Configuration</h3>
					<div className="flex space-x-2 items-center">
						<span className="text-sm text-gray-500">Finger:</span>
						<div className="flex space-x-1">
							{FINGER_OPTIONS.map((finger) => (
								<button
									key={finger}
									type="button"
									onClick={() => handleFingerChange(finger)}
									className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors
										${isFingerActive(finger)
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
						{/* Fret window navigation */}
						<div className="flex items-center justify-between mb-4">
							<Button
								variant="outline"
								size="sm"
								onClick={() => shiftWindow("left")}
								disabled={windowStart === 0}
								aria-label="Previous frets"
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
								aria-label="Next frets"
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>

						{/* String configuration grid */}
						<div className="flex flex-col space-y-8">
							{chord.notes.map((note, index) => (
								<div
									key={index}
									className={`flex items-center space-x-4 p-2 rounded-lg transition-colors
										${isStringActive(index)
										? "bg-blue-50 dark:bg-blue-950/30 ring-2 ring-blue-500/20"
										: ""
									}`}
								>
									{/* String label */}
									<Tooltip>
										<TooltipTrigger>
											<div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-colors
												${isStringActive(index)
												? "bg-blue-500 text-white"
												: "bg-gray-200 dark:bg-gray-700"
											}`}
											>
												{STRINGS[index]}
											</div>
										</TooltipTrigger>
										<TooltipContent>
											String {6 - index} ({STRINGS[index]})
										</TooltipContent>
									</Tooltip>

									{/* Interactive fretboard */}
									<div className="flex-1 relative h-12 group">
										<div
											className="absolute top-1/2 w-full h-8 -translate-y-1/2 cursor-pointer"
											onClick={(e) => handleFretClick(index, e)}
											onTouchMove={(e) => handleTouchMove(index, e)}
											onTouchStart={(e) => e.preventDefault()}
										>
											{/* Fretboard line */}
											<div className="w-full h-1 bg-gray-300 dark:bg-gray-600">
												{Array.from({ length: FRETS_IN_WINDOW }, (_, i) => (
													<div
														key={i}
														className="absolute h-3 w-0.5 bg-gray-400 dark:bg-gray-500"
														style={{ left: `${(i / (FRETS_IN_WINDOW - 1)) * 100}%` }}
													>
														<span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs">
															{windowStart + i}
														</span>
													</div>
												))}
											</div>

											{/* Finger position indicator */}
											{isFretInWindow(note.fret) && (
												<div
													className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-blue-500 shadow-lg transition-all"
													style={{
														left: `${getPositionInWindow(note.fret)}%`,
														transform: "translate(-50%, -50%)",
													}}
												>
													<span className="absolute inset-0 flex items-center justify-center text-white text-sm">
														{note.finger?.toString() || activeFinger}
													</span>
												</div>
											)}
										</div>
									</div>

									{/* Controls */}
									<div className="flex items-center gap-2">
										{/* Fret input */}
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="relative">
													<Input
														type="number"
														value={note.fret ?? ""}
														onChange={(e) => handleFretInputChange(index, e.target.value)}
														onFocus={() => setLastActiveString(index)}
														className={`w-16 text-center ${
															note.fret === null ? "opacity-60" : ""
														}`}
														min="0"
														max={MAX_FRET}
														placeholder="-"
														aria-label={`Fret for string ${STRINGS[index]}`}
													/>
													{note.fret === null && (
														<span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-semibold">
															X
														</span>
													)}
												</div>
											</TooltipTrigger>
											<TooltipContent>Fret number</TooltipContent>
										</Tooltip>

										{/* Mute button */}
										<button
											type="button"
											aria-label={`Mute string ${STRINGS[index]}`}
											onClick={() => handleMute(index)}
											className={`w-8 h-8 rounded-md border flex items-center justify-center text-sm font-semibold transition-colors
												${note.fret === null
												? "bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-black"
												: "bg-gray-100 border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700"
											}`}
										>
											X
										</button>

										{/* Open string button */}
										<button
											type="button"
											aria-label={`Open string ${STRINGS[index]}`}
											onClick={() => handleOpen(index)}
											className={`w-8 h-8 rounded-md border flex items-center justify-center text-sm font-semibold transition-colors
												${note.fret === 0
												? "bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-black"
												: "bg-gray-100 border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700"
											}`}
										>
											O
										</button>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</TooltipProvider>
	);
};