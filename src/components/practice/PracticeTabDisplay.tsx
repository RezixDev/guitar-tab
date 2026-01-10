"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PracticeTabDisplayProps {
  tabs: string[];
  className?: string;
}

export function PracticeTabDisplay({
  tabs,
  className = "",
}: PracticeTabDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const tabText = tabs.join("\n");
    try {
      await navigator.clipboard.writeText(tabText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Card className={`relative ${className}`}>
      <CardContent className="pt-6">
        <div className="absolute top-2 right-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 w-8 p-0"
                aria-label={copied ? "Copied" : "Copy tabs to clipboard"}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? "Copied!" : "Copy tabs"}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <pre className="font-mono text-sm md:text-base lg:text-lg bg-muted/50 p-4 rounded-lg overflow-x-auto">
          {tabs.map((line, index) => (
            <div key={index} className="whitespace-pre">
              {line}
            </div>
          ))}
        </pre>
      </CardContent>
    </Card>
  );
}
