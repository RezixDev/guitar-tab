import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { PracticeExercise } from "@shared/types/practice";
import { Button } from "@shared/ui/Button";
import { exerciseToAscii } from "../lib/exerciseHelpers";
import { TabRenderer } from "./TabRenderer";

type PracticeTabDisplayProps = {
  exercise: PracticeExercise;
};

export function PracticeTabDisplay({ exercise }: PracticeTabDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exerciseToAscii(exercise));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative">
      <div className="absolute right-2 top-2 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="size-8 p-0"
          aria-label="Copy tabs as ASCII"
        >
          {copied ? (
            <Check className="size-4 text-[var(--color-success)]" />
          ) : (
            <Copy className="size-4" />
          )}
        </Button>
      </div>
      <TabRenderer exercise={exercise} />
    </div>
  );
}
