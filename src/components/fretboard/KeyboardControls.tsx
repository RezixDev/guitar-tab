// components/KeyboardControls.tsx
"use client";

type ShortcutProps = {
	description: string;
	keys: string[];
}

type KeyboardControlsProps = {
	translations: {
		title: string;
		shortcuts: {
			navigate: string;
			selectNote: string;
			nextNote: string;
		};
	};
}
function Shortcut({ description, keys }: ShortcutProps) {
	return (
		<li className="flex items-center gap-2">
			<span className="text-muted-foreground">{description}:</span>
			<div className="flex gap-1" aria-label={description}>
				{keys.map((keyLabel) => (
					<kbd
						key={`${description}-${keyLabel}`}
						className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground"
					>
						{keyLabel}
					</kbd>
				))}
			</div>
		</li>
	)
}
export function KeyboardControls({ translations }: KeyboardControlsProps) {

	const shortcuts = [
		{ description: translations.shortcuts.navigate,    keys: ["←", "↑", "↓", "→"] as const },
		{ description: translations.shortcuts.selectNote, keys: ["Space"] as const },
		{ description: translations.shortcuts.nextNote,   keys: ["Enter"] as const },
	] satisfies ShortcutProps[]

	return (
		<section className="mt-4 text-sm border rounded-lg p-4 bg-muted/5">
			<h3 className="font-medium mb-3">{translations.title}</h3>
			<ul className="flex flex-wrap gap-6">
				{shortcuts.map((s) => (
					<Shortcut key={s.description} description={s.description} keys={[...s.keys]} />
				))}
			</ul>
		</section>
	)
}