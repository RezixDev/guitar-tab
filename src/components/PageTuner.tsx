"use client";

import { GuitarTuner } from "@/components/GuitarTuner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

export function PageTuner() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			{/* Main Tuner Section */}
			<div className="lg:col-span-2">
				<GuitarTuner />
			</div>

			{/* Information Section */}
			<div className="lg:col-span-1">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Info className="w-5 h-5" />
							Tuning Guide
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Accordion type="single" collapsible className="w-full">
							<AccordionItem value="standard-tuning">
								<AccordionTrigger>Standard Tuning (EADGBe)</AccordionTrigger>
								<AccordionContent>
									<p className="text-sm text-muted-foreground mb-2">
										The most common guitar tuning, from lowest to highest
										string:
									</p>
									<ul className="list-disc list-inside space-y-1 text-sm">
										<li>6th string (thickest): E2 (82.41 Hz)</li>
										<li>5th string: A2 (110.00 Hz)</li>
										<li>4th string: D3 (146.83 Hz)</li>
										<li>3rd string: G3 (196.00 Hz)</li>
										<li>2nd string: B3 (246.94 Hz)</li>
										<li>1st string (thinnest): E4 (329.63 Hz)</li>
									</ul>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="how-to-tune">
								<AccordionTrigger>How to Tune Your Guitar</AccordionTrigger>
								<AccordionContent>
									<ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
										<li>Click on a note button to play the reference tone</li>
										<li>Adjust your guitar string until it matches the tone</li>
										<li>
											Use the volume slider to adjust the reference tone volume
										</li>
										<li>
											Tune one string at a time, from thickest to thinnest
										</li>
										<li>Double-check each string after tuning all of them</li>
									</ol>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="tips">
								<AccordionTrigger>Tuning Tips</AccordionTrigger>
								<AccordionContent>
									<ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
										<li>Always tune up to the note, not down</li>
										<li>Make small adjustments to the tuning pegs</li>
										<li>New strings may need to be retuned more frequently</li>
										<li>Ensure you&apos;re in a quiet environment</li>
										<li>Check your tuning before each practice session</li>
									</ul>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
