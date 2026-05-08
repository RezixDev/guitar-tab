import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@shared/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui/DropdownMenu";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const Icon = resolvedTheme === "dark" ? Moon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Toggle theme">
          <Icon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuItem
          onSelect={() => setTheme("light")}
          aria-current={theme === "light"}
        >
          <Sun className="size-4" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => setTheme("dark")}
          aria-current={theme === "dark"}
        >
          <Moon className="size-4" /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => setTheme("system")}
          aria-current={theme === "system"}
        >
          <Monitor className="size-4" /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
