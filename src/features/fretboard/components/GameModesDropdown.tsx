import { Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui/Select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@shared/ui/Tooltip";
import type { GameMode } from "@shared/types/fretboard";

type GameModeTranslations = { label: string; description: string };

type GameModesDropdownProps = {
  value: GameMode;
  onChange: (mode: GameMode) => void;
  disabled?: boolean;
  translations: {
    placeholder: string;
    modes: { [k in GameMode]: GameModeTranslations };
  };
};

const ORDER = ["newbie", "easy", "findAll", "hard", "time"] as const satisfies readonly GameMode[];

export function GameModesDropdown({
  value,
  onChange,
  disabled = false,
  translations,
}: GameModesDropdownProps) {
  return (
    <TooltipProvider>
      <Select value={value} onValueChange={(v) => onChange(v as GameMode)} disabled={disabled}>
        <SelectTrigger className="w-full md:w-[220px]">
          <SelectValue placeholder={translations.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {ORDER.map((key) => {
            const { label, description } = translations.modes[key];
            return (
              <SelectItem key={key} value={key}>
                <div className="flex items-center justify-between gap-2">
                  <span>{label}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0} className="inline-flex">
                        <Info className="size-4 text-[var(--color-fg-muted)]" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-[260px]">{description}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </TooltipProvider>
  );
}
