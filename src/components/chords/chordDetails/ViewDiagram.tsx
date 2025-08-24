import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Guitar, Palette } from "lucide-react";
import { ChordModal } from "@/components/chords/chordDetails/ChordModal";
import { FloatingChordViewerProps } from "@/types/chord";
import { chordThemes } from "@/types/chord";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function ViewDiagram({
	chord,
	ChordSVGComponent,
	isOpen,
	onOpenChange,
	selectedTheme,  // RECEIVE AS PROP
	onThemeChange,  // RECEIVE AS PROP
}: FloatingChordViewerProps & {
	selectedTheme: string;
	onThemeChange: (theme: string) => void;
}) {
	return (
		<>
			{/* Mobile version with tooltip */}
			<div className="md:hidden">
				<TooltipProvider>
					<Tooltip delayDuration={300}>
						<TooltipTrigger asChild>
							<Button
								onClick={() => onOpenChange(true)}
								className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg
                  transition-all duration-300 ease-in-out
                  bg-primary hover:bg-primary/90"
								size="icon"
							>
								<Guitar className="h-5 w-5" />
								<span className="sr-only">View Chord Diagram</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent side="left" align="center">
							<p>View Chord Diagram</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			{/* Desktop version */}
			<Button
				onClick={() => onOpenChange(true)}
				className="hidden md:inline-flex gap-2"
			>
				<Guitar className="w-4 h-4" />
				View Diagram
			</Button>

			<ChordModal
				chord={chord}
				isOpen={isOpen}
				onClose={() => onOpenChange(false)}
				ChordSVGComponent={ChordSVGComponent}
				selectedTheme={selectedTheme}  // PASS THROUGH
				onThemeChange={onThemeChange}  // PASS THROUGH
			/>
		</>
	);
}
