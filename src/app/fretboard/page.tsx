// app/fretboard/page.tsx
import React from "react";
import FretboardGame from "@/components/fretboard/FretboardGame";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
	return (
		<div className="container mx-auto py-6">
			<Card>
				<CardHeader>
					<CardTitle>Fretboard Guessing Game</CardTitle>
				</CardHeader>
				<CardContent>
					<FretboardGame />
				</CardContent>
			</Card>
		</div>
	);
}
