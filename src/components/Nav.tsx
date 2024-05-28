import Link from 'next/link';
import React from 'react';

const Nav: React.FC = () => {
  return (
    <nav className='bg-gray-800 p-4'>
      <ul className='flex space-x-4'>
        <li>
          <Link href='/'>
            <a className='text-white'>Home</a>
          </Link>
        </li>
        <li>
          <Link href='/fretboard'>
            <a className='text-white'>Fretboard</a>
          </Link>
        </li>
        {/* Add other navigation links here */}
      </ul>
    </nav>
  );
};

export default Nav;
