import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import type { ChangeEvent } from "react";

type ChordSearchProps = {
  searchTerm: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
};

export function ChordSearch({
  searchTerm,
  onSearchChange,
  onClear,
}: ChordSearchProps) {
  return (
    <div className="relative">
      <Label htmlFor="chord-search" className="sr-only">
        Search chords
      </Label>
      <Input
        id="chord-search"
        type="text"
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search chords..."
        className="w-full pr-10"
      />
      {searchTerm && onClear && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={onClear}
          aria-label="Clear search"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </Button>
      )}
    </div>
  );
}
