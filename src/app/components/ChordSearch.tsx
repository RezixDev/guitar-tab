import React from 'react';

interface ChordSearchProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChordSearch: React.FC<ChordSearchProps> = ({
  searchTerm,
  onSearchChange,
}) => (
  <div className='mb-4'>
    <label className='mr-2'>Search Chords</label>
    <input
      type='text'
      value={searchTerm}
      onChange={onSearchChange}
      className='border p-1'
    />
  </div>
);

export default ChordSearch;
