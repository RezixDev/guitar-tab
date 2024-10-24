// components/theme-toggle.tsx
"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<Button
			variant="ghost"
			onClick={() => setTheme(theme === "light" ? "dark" : "light")}
		>
			{theme === "light" ? (
				<MoonIcon className="w-5 h-5" />
			) : (
				<SunIcon className="w-5 h-5" />
			)}
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
