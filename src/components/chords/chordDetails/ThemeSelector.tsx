import React from "react";
import { Palette } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { chordThemes } from "@/types/chord";

type ThemeSelectorProps = {
    currentTheme: string;
    onThemeChange: (theme: string) => void;
    variant?: "dropdown" | "select" | "buttons";
};

export function ThemeSelector({
                                  currentTheme,
                                  onThemeChange,
                                  variant = "select"
                              }: ThemeSelectorProps) {

    if (variant === "dropdown") {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Palette className="w-4 h-4" />
                        {chordThemes[currentTheme]?.name || "Theme"}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {Object.entries(chordThemes).map(([key, theme]) => (
                        <DropdownMenuItem
                            key={key}
                            onClick={() => onThemeChange(key)}
                            className={currentTheme === key ? "bg-accent" : ""}
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
        );
    }

    if (variant === "buttons") {
        return (
            <div className="flex flex-wrap gap-2">
                {Object.entries(chordThemes).map(([key, theme]) => (
                    <Button
                        key={key}
                        variant={currentTheme === key ? "default" : "outline"}
                        size="sm"
                        onClick={() => onThemeChange(key)}
                        className="gap-2"
                    >
                        <div
                            className="w-4 h-4 rounded border"
                            style={{
                                backgroundColor: theme.backgroundColor,
                                borderColor: theme.textColor
                            }}
                        />
                        {theme.name}
                    </Button>
                ))}
            </div>
        );
    }

    // Default: select variant
    return (
        <Select value={currentTheme} onValueChange={onThemeChange}>
            <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    <SelectValue placeholder="Select theme" />
                </div>
            </SelectTrigger>
            <SelectContent>
                {Object.entries(chordThemes).map(([key, theme]) => (
                    <SelectItem key={key} value={key}>
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
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}