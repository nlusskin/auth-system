import React from 'react'

import spinner from './spin.gif'

export default function Loading() {
  
  return (
    <div className='mx-auto w-6 h-6'>
      <img src={spinner} className='w-full h-full' />
    </div>
  )
}
