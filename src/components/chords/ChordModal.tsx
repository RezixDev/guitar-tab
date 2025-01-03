import { ChordModalProps } from "@/types/chord";
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
import { Guitar, Download, Share2, ClipboardCopy } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChordModal({
	chord,
	isOpen,
	onClose,
	ChordSVGComponent,
}: ChordModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[600px] p-0 max-h-[90vh] overflow-auto">
				<DialogHeader className="px-4 pt-4 pb-3 border-b sm:px-6 sm:pt-6 sm:pb-4">
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
				</DialogHeader>

				<div className="p-4 sm:p-6">
					{/* Chord Diagram */}
					<Card className="border">
						<CardContent className="p-2 sm:p-4">
							<ChordSVGComponent
								chord={chord.notes}
								chordName={chord.name}
								startingFret={chord.startingFret}
							/>
						</CardContent>
					</Card>

					{/* Chord Type - Shown below diagram */}
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
				</div>

				<DialogFooter className="px-4 py-3 border-t sm:px-6 sm:py-4">
					<div className="flex justify-between w-full">
						<div className="flex gap-1 sm:gap-2">
							<Button
								variant="secondary"
								size="sm"
								className="gap-1 text-xs sm:text-sm sm:gap-2"
							>
								<Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
								Share
							</Button>
							<Button
								variant="secondary"
								size="sm"
								className="gap-1 text-xs sm:text-sm sm:gap-2"
							>
								<Download className="w-3 h-3 sm:w-4 sm:h-4" />
								Download
							</Button>
						</div>
						<Button
							variant="default"
							size="sm"
							className="gap-1 text-xs sm:text-sm sm:gap-2"
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
