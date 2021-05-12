import React from 'react'
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome'
import { faDoorOpen, faCog, faHome } from '@fortawesome/free-solid-svg-icons'

import RouterContext from '@providers/Router'

export default function Header() {

  const { page, navigate } = React.useContext(RouterContext);
  
  return (
    <div className='w-full h-1 border-gray-400'>
      <a
        href='/logout'
        className='float-right p-4 align-middle'
      >
        <FAIcon icon={faDoorOpen} className='text-gray-400'/>
      </a>
      
      <div className='float-right p-4 align-middle' onClick={() => navigate('settings')}>
        <FAIcon icon={faCog} className='text-gray-400' />
      </div>
   
      <div className='float-right p-4 align-middle' onClick={() => navigate(('welcome'))}>
        <FAIcon icon={faHome} className='text-gray-400' />
      </div>
    </div>
  )
}
