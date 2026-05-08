import type { ChangeEvent } from "react";
import { Input } from "@shared/ui/Input";

type ChordSearchProps = {
  searchTerm: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function ChordSearch({ searchTerm, onSearchChange }: ChordSearchProps) {
  return (
    <Input
      type="text"
      value={searchTerm}
      onChange={onSearchChange}
      placeholder="Search chords..."
      className="w-full"
    />
  );
}
