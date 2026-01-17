import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type GameMode = "newbie" | "easy" | "hard" | "time" | "findAll"

type GameModeTranslations = {
	label: string
	description: string
}

type GameModesDropdownProps = {
	value: GameMode
	onChange: (mode: GameMode) => void
	disabled?: boolean
	translations: {
		placeholder: string
		modes: { [k in GameMode]: GameModeTranslations }
	}
}

const ORDER = ["newbie", "easy", "findAll", "hard", "time"] as const satisfies readonly GameMode[]

export function GameModesDropdown({
	value,
	onChange,
	disabled = false,
	translations,
}: GameModesDropdownProps) {
	const selectedDescription = translations.modes[value].description;
	const descriptionId = "game-mode-description";

	return (
		<div className="flex flex-col gap-2">
			<Select value={value} onValueChange={(v) => onChange(v as GameMode)} disabled={disabled}>
				<SelectTrigger className="w-full md:w-[200px]" aria-describedby={descriptionId}>
					<SelectValue placeholder={translations.placeholder} />
				</SelectTrigger>
				<SelectContent>
					{ORDER.map((key) => {
						const { label } = translations.modes[key]
						return (
							<SelectItem key={key} value={key}>
								{label}
							</SelectItem>
						)
					})}
				</SelectContent>
			</Select>
			<p id={descriptionId} className="text-sm text-muted-foreground">
				{selectedDescription}
			</p>
		</div>
	)
}
