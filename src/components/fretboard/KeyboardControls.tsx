// components/KeyboardControls.tsx
"use client";
import React from "react";

interface ShortcutProps {
	description: string;
	keys: string[];
}

interface KeyboardControlsProps {
	translations: {
		title: string;
		shortcuts: {
			navigate: string;
			selectNote: string;
			nextNote: string;
		};
	};
}

const Shortcut: React.FC<ShortcutProps> = ({ description, keys }) => (
	<div className="flex items-center gap-2">
		<span className="text-muted-foreground">{description}:</span>
		<div className="flex gap-1">
			{keys.map((key, index) => (
				<kbd
					key={index}
					className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground"
				>
					{key}
				</kbd>
			))}
		</div>
	</div>
);

export const KeyboardControls: React.FC<KeyboardControlsProps> = ({
	translations,
}) => {
	const shortcuts: ShortcutProps[] = [
		{
			description: translations.shortcuts.navigate,
			keys: ["←", "↑", "↓", "→"],
		},
		{
			description: translations.shortcuts.selectNote,
			keys: ["Space"],
		},
		{
			description: translations.shortcuts.nextNote,
			keys: ["Enter"],
		},
	];

	return (
		<div className="mt-4 text-sm border rounded-lg p-4 bg-muted/5">
			<h3 className="font-medium mb-3">{translations.title}</h3>
			<div className="flex flex-wrap gap-6">
				{shortcuts.map((shortcut, index) => (
					<Shortcut
						key={index}
						description={shortcut.description}
						keys={shortcut.keys}
					/>
				))}
			</div>
		</div>
	);
};
