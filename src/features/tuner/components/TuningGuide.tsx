import { Info } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@shared/ui/Accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/Card";
import type { TunerNote } from "../types";

type TuningGuideProps = {
  tuningLabel: string;
  notes: TunerNote[];
};

const ORDINAL_SUFFIXES = ["th", "st", "nd", "rd"];
function ordinal(n: number): string {
  const v = n % 100;
  return n + (ORDINAL_SUFFIXES[(v - 20) % 10] ?? ORDINAL_SUFFIXES[v] ?? "th");
}

function stringLabel(stringNumber: number, total: number): string {
  if (stringNumber === total) return `${ordinal(stringNumber)} (thickest)`;
  if (stringNumber === 1) return "1st (thinnest)";
  return ordinal(stringNumber);
}

export function TuningGuide({ tuningLabel, notes }: TuningGuideProps) {
  // Render thickest → thinnest (the way guitarists usually list strings)
  const ordered = [...notes].sort((a, b) => b.string - a.string);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="size-5" />
          Tuning Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="active-tuning">
            <AccordionTrigger>{tuningLabel}</AccordionTrigger>
            <AccordionContent>
              <ul className="list-inside list-disc space-y-1 text-sm text-[var(--color-fg-muted)]">
                {ordered.map((n) => (
                  <li key={`${n.string}-${n.note}`}>
                    {stringLabel(n.string, notes.length)}: {n.note} (
                    {n.frequency.toFixed(2)} Hz)
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="how-to-tune">
            <AccordionTrigger>How to Tune</AccordionTrigger>
            <AccordionContent>
              <ol className="list-inside list-decimal space-y-2 text-sm text-[var(--color-fg-muted)]">
                <li>Pick a tuning from the dropdown</li>
                <li>Click "Start Tuning"</li>
                <li>Play a single string</li>
                <li>Adjust the tuning peg until "In Tune" appears</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
