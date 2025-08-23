import { Input } from "@/components/ui/input";
import type { ChangeEvent } from 'react';

interface ChordSearchProps {
  searchTerm: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function ChordSearch({ searchTerm, onSearchChange }: ChordSearchProps) {
  return (
    <div className="space-y-2">
      <Input
        type="text"
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search chords..."
        className="w-full"
      />
    </div>
  );
}
