import React from 'react';

interface ChordSearchProps {
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChordSearch: React.FC<ChordSearchProps> = ({ searchTerm, onSearchChange }) => (
  <div className="mb-6">
    <label htmlFor="chord-search" className="block text-lg font-medium mb-2">
      Search Chords
    </label>
    <input
      type="text"
      id="chord-search"
      value={searchTerm}
      onChange={onSearchChange}
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter chord name"
    />
  </div>
);

export default ChordSearch;