import { ChordModalProps } from "@/types/chord";
import { chordThemes } from "@/types/chord";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Guitar, Download, Share2, ClipboardCopy, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExtendedChordModalProps extends ChordModalProps {
	selectedTheme?: string;
	onThemeChange?: (theme: string) => void;
}

export function ChordModal({
	chord,
	isOpen,
	onClose,
	ChordSVGComponent,
	selectedTheme = "classic",
	onThemeChange,
}: ExtendedChordModalProps) {
	const handleThemeChange = (theme: string) => {
		if (onThemeChange) {
			onThemeChange(theme);
			// Save to localStorage
			if (typeof window !== 'undefined') {
				localStorage.setItem('chordTheme', theme);
			}
		}
	};

	const currentTheme = chordThemes[selectedTheme] || chordThemes.classic;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[600px] p-0 max-h-[90vh] overflow-auto">
				<DialogHeader className="px-4 pt-4 pb-3 border-b sm:px-6 sm:pt-6 sm:pb-4">
					<div className="flex items-center justify-between w-full">
					<div className="flex items-center gap-2">
						<Guitar className="w-5 h-5 text-primary sm:w-6 sm:h-6" />
						<div>
							<DialogTitle className="text-xl font-semibold tracking-tight sm:text-2xl">
								{chord.name} Chord
							</DialogTitle>
							<DialogDescription className="text-sm">
								Starting from fret {chord.startingFret}
							</DialogDescription>
						</div>
					</div>
						{/* Theme Selector */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm" className="gap-2">
									<Palette className="w-4 h-4" />
									<span className="hidden sm:inline">{currentTheme.name}</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{Object.entries(chordThemes).map(([key, theme]) => (
									<DropdownMenuItem
										key={key}
										onClick={() => handleThemeChange(key)}
										className={selectedTheme === key ? "bg-accent" : ""}
									>
										<div className="flex items-center gap-2">
											<div
												className="w-4 h-4 rounded border"
												style={{
													backgroundColor: theme.backgroundColor,
													borderColor: theme.textColor
												}}
											/>
											{theme.name}
										</div>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</DialogHeader>

				<div className="p-4 sm:p-6">
					{/* Chord Diagram with Theme */}
					<Card className="border-0 shadow-none">
						<CardContent className="p-0">
							<ChordSVGComponent
								chord={chord.notes}
								chordName={chord.name}
								startingFret={chord.startingFret}
								theme={currentTheme}
							/>
						</CardContent>
					</Card>

					{/* Chord Type - Only show if theme shows string names */}
					{currentTheme.showStringNames && (
					<Card className="mt-4">
						<CardContent className="p-3 sm:p-4">
							<h3 className="text-base font-semibold mb-2 sm:text-lg">
								Chord Type
							</h3>
							<div className="flex gap-2 flex-wrap">
								{chord.name.split(" ").map((part, index) => (
									<span
										key={index}
										className={cn(
											"px-2 py-1 rounded-md text-xs sm:text-sm",
											index === 0
												? "bg-primary text-primary-foreground"
												: "bg-secondary"
										)}
									>
										{part}
									</span>
								))}
							</div>
						</CardContent>
					</Card>
					)}
				</div>

				<DialogFooter className="px-4 py-3 border-t sm:px-6 sm:py-4">
					<div className="flex justify-between w-full">
						<div className="flex gap-1 sm:gap-2">
							<Button
								variant="secondary"
								size="sm"
								className="gap-1 text-xs sm:text-sm sm:gap-2"
								onClick={() => {
									// Implement share functionality
									if (navigator.share) {
										navigator.share({
											title: `${chord.name} Chord`,
											text: `Check out this ${chord.name} chord diagram`,
										});
									}
								}}
							>
								<Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
								Share
							</Button>
							<Button
								variant="secondary"
								size="sm"
								className="gap-1 text-xs sm:text-sm sm:gap-2"
								onClick={() => {
									// Implement download functionality
									const svgElement = document.querySelector('svg[role="img"]');
									if (svgElement) {
										const svgData = new XMLSerializer().serializeToString(svgElement);
										const blob = new Blob([svgData], { type: 'image/svg+xml' });
										const url = URL.createObjectURL(blob);
										const a = document.createElement('a');
										a.href = url;
										a.download = `${chord.name.replace(/\s+/g, '-')}-chord.svg`;
										document.body.appendChild(a);
										a.click();
										document.body.removeChild(a);
										URL.revokeObjectURL(url);
									}
								}}
							>
								<Download className="w-3 h-3 sm:w-4 sm:h-4" />
								Download
							</Button>
						</div>
						<Button
							variant="default"
							size="sm"
							className="gap-1 text-xs sm:text-sm sm:gap-2"
							onClick={() => {
								// Copy chord notation to clipboard
								const notation = chord.notes
									.map(n => n.fret === null ? 'x' : n.fret)
									.join('-');
								navigator.clipboard.writeText(`${chord.name}: ${notation}`);
							}}
						>
							<ClipboardCopy className="w-3 h-3 sm:w-4 sm:h-4" />
							Copy
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
