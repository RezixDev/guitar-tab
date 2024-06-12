import React from 'react';

interface ModeToggleProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({
  label,
  checked,
  onChange,
}) => (
  <div className='mb-4'>
    <label htmlFor={label} className='mr-2'>
      {label}:
    </label>
    <input
      type='checkbox'
      id={label}
      checked={checked}
      onChange={onChange}
      className='mr-2'
    />
    <span>
      {label === 'newbieMode'
        ? 'Show All Notes'
        : label === 'easyMode'
        ? 'Guess One Position'
        : 'Guess All Positions'}
    </span>
  </div>
);

export default ModeToggle;
