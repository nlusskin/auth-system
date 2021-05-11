import React from 'react'

import Loading from '@components/Loading';
import { useAPI } from '@hooks/useAPI'


export default function Welcome() {

  const { data, call } = useAPI('welcome');

  React.useEffect(call, []);

  return <div className='w-1/4 h-1/4 vertical-center mx-auto'><Loading /></div>

  return (
    <div className='w-2/3 h-2/3 mx-auto vertical-center'>
      <p>{data.msg}</p>
    </div>
  )
}