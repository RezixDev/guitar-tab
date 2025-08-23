import type { ChordState, Note } from "@/types/chord";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { StringConfiguration } from "./StringConfiguration";

export type ChordDetailsProps = {
	chord: ChordState;
	onNameChange: (value: string) => void;
	onStartingFretChange: (value: string) => void;
	onNoteChange: (index: number, field: keyof Note, value: string) => void;
};

export function ChordDetails({
	chord,
	onNameChange,
	onStartingFretChange,
	onNoteChange,
}: ChordDetailsProps) {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="chord-name">Chord Name</Label>
					<Input
						id="chord-name"
						value={chord.name}
						onChange={(e) => onNameChange(e.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="starting-fret">Starting Fret</Label>
					<Input
						type="number"
						id="starting-fret"
						value={chord.startingFret}
						onChange={(e) => onStartingFretChange(e.target.value)}
					/>
				</div>
			</div>
			<Separator />
			<StringConfiguration chord={chord} onNoteChange={onNoteChange} />
		</div>
	);
}
