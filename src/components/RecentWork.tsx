import React from 'react';

export const RecentWork = () => {
  return (
    <div className='py-10 bg-blue-100 flex justify-center items-center min-h-screen'>
      <div className='w-3/4 bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-6 shadow-lg'>
        <h2 className='text-center text-2xl font-bold mb-6 text-black'>
          Recent work
        </h2>
        <div className='flex justify-center gap-6'>
          <div className='w-36 h-36 bg-white bg-opacity-20 backdrop-blur-lg flex items-center justify-center text-black text-lg rounded-lg shadow-lg'>
            imagem
          </div>
          <div className='w-36 h-36 bg-white bg-opacity-20 backdrop-blur-lg flex items-center justify-center text-black text-lg rounded-lg shadow-lg'>
            imagem
          </div>
          <div className='w-36 h-36 bg-white bg-opacity-20 backdrop-blur-lg flex items-center justify-center text-black text-lg rounded-lg shadow-lg'>
            imagem
          </div>
          <div className='w-36 h-36 bg-white bg-opacity-20 backdrop-blur-lg flex items-center justify-center text-black text-lg rounded-lg shadow-lg'>
            imagem
          </div>
        </div>
      </div>
    </div>
  );
};
