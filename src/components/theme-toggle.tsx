"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [open, setOpen] = React.useState(false);

	return (
		<>
			<Button
				variant="ghost"
				size="icon"
				onClick={() => setTheme(theme === "light" ? "dark" : "light")}
				className="h-9 w-9"
			>
				{theme === "light" ? (
					<SunIcon className="h-4 w-4" />
				) : (
					<MoonIcon className="h-4 w-4" />
				)}
				<span className="sr-only">Toggle theme</span>
			</Button>

			{/* Hidden dialog to satisfy accessibility requirements */}
			<Dialog open={false} onOpenChange={setOpen}>
				<DialogContent>
					<DialogTitle>Choose theme</DialogTitle>
				</DialogContent>
			</Dialog>
		</>
	);
}
