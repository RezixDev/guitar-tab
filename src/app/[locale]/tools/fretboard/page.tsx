// app/fretboard/page.tsx
import React from "react";
import { FretboardGame } from "@/components/fretboard/FretboardGame";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
	return (
		<div className="container mx-auto py-6">
			<Card>
				<CardHeader>
					<CardTitle>Fretboard Guessing Game</CardTitle>
				</CardHeader>
				<CardContent>
					<FretboardGame />
					<div className="mt-4">
						<Link href="/">Back to Home</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
