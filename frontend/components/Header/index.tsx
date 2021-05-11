import React from 'react'
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome'
import { faDoorOpen, faCog } from '@fortawesome/free-solid-svg-icons'

export default function Header() {
  
  return (
    <div className='w-full h-1 border-gray-400'>
      <a
        href='/logout'
        className='float-right p-4 align-middle'
      >
        <FAIcon icon={faDoorOpen} className='text-gray-400'/>
      </a>
      
      <div className='float-right p-4 align-middle'>
        <FAIcon icon={faCog} className='text-gray-400' />
      </div>
    </div>
  )
}
