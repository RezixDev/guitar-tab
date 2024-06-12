import React, { useState, useEffect } from 'react';
import FretboardGame from '../components/FretboardGame';

export default function Page() {
  return (
    <>
      <div className='container mx-auto'>
        <FretboardGame />
      </div>
    </>
  );
}
