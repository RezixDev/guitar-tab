import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import type { ChangeEvent } from "react";

type ChordSearchProps = {
  searchTerm: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function ChordSearch({ searchTerm, onSearchChange }: ChordSearchProps) {
  const handleClear = () => {
    // Create a synthetic event to compatible with the existing handler
    const event = {
      target: { value: "" },
    } as unknown as ChangeEvent<HTMLInputElement>;
    onSearchChange(event);
  };

  return (
    <div className="relative">
      <Search
        className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="text"
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search chords..."
        className="w-full pl-9 pr-10"
        aria-label="Search chords"
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-9 w-9 hover:bg-transparent"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </Button>
      )}
    </div>
  );
}
