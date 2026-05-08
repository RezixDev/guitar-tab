import { Palette } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/Select";
import { Button } from "@shared/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui/DropdownMenu";
import { chordThemes } from "../data/themes";

type ThemeSelectorProps = {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  variant?: "dropdown" | "select" | "buttons";
};

export function ThemeSelector({
  currentTheme,
  onThemeChange,
  variant = "select",
}: ThemeSelectorProps) {
  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Palette className="size-4" />
            {chordThemes[currentTheme]?.name || "Theme"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {Object.entries(chordThemes).map(([key, theme]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => onThemeChange(key)}
              className={currentTheme === key ? "bg-[var(--color-accent-soft)]" : ""}
            >
              <ThemeSwatch theme={theme} />
              {theme.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === "buttons") {
    return (
      <div className="flex flex-wrap gap-2">
        {Object.entries(chordThemes).map(([key, theme]) => (
          <Button
            key={key}
            variant={currentTheme === key ? "primary" : "outline"}
            size="sm"
            onClick={() => onThemeChange(key)}
            className="gap-2"
          >
            <ThemeSwatch theme={theme} />
            {theme.name}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <Select value={currentTheme} onValueChange={onThemeChange}>
      <SelectTrigger className="w-full">
        <div className="flex items-center gap-2">
          <Palette className="size-4" />
          <SelectValue placeholder="Select theme" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(chordThemes).map(([key, theme]) => (
          <SelectItem key={key} value={key}>
            <div className="flex items-center gap-2">
              <ThemeSwatch theme={theme} />
              {theme.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ThemeSwatch({ theme }: { theme: { backgroundColor: string; textColor: string } }) {
  return (
    <span
      aria-hidden
      className="inline-block size-4 rounded border"
      style={{ backgroundColor: theme.backgroundColor, borderColor: theme.textColor }}
    />
  );
}
