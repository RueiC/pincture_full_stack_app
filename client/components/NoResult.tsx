import React from 'react';

const NoResult = () => {
  return (
    <div className='flex items-center justify-start w-screen'>
      <div className='flex items-center gap-[10px]'>
        <img className='rounded-full' src='' alt='' />
        <h1>沒有符合的項目</h1>
      </div>
    </div>
  );
};

export default NoResult;
