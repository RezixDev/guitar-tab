import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export type GameMode = "newbie" | "easy" | "hard" | "time"

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

const ORDER = ["newbie", "easy", "hard", "time"] as const satisfies readonly GameMode[]

export function GameModesDropdown({
	value,
	onChange,
	disabled = false,
	translations,
}: GameModesDropdownProps) {
	return (
		<div className="flex items-center gap-2">
      <TooltipProvider>
        <Select value={value} onValueChange={(v) => onChange(v as GameMode)} disabled={disabled}>
				<SelectTrigger className="w-[200px]">
					<SelectValue placeholder={translations.placeholder} />
				</SelectTrigger>
				<SelectContent>
            {ORDER.map((key) => {
              const { label, description } = translations.modes[key]
              return (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center justify-between gap-2">
							<span>{label}</span>
								<Tooltip>
									<TooltipTrigger asChild>
                        <span tabIndex={0} className="inline-flex">
										<Info className="h-4 w-4 text-muted-foreground" />
                        </span>
									</TooltipTrigger>
									<TooltipContent>
										<p>{description}</p>
									</TooltipContent>
								</Tooltip>
                  </div>
						</SelectItem>
              )
            })}
				</SelectContent>
			</Select>
      </TooltipProvider>
		</div>
  )
}
