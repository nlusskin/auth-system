import React from 'react'

import Loading from '@components/Loading';
import { useAPI } from '@hooks/useAPI'

export default function Welcome() {

  const { data, call } = useAPI('welcome');

  React.useEffect(call, []);

  if (!data) return <div className='w-1/4 h-1/4 vertical-center mx-auto'><Loading /></div>

  return (
    <div className='w-2/3 h-2/3 mx-auto mt-48 text-center'>
      <p className='text-2xl'>{data.msg}</p>
      {/* <img src={data.img} className='w-full' /> */}
      <div
        className='w-full h-2/3 rounded-lg shadow-lg bg-center bg-no-repeat mt-10'
        style={{backgroundImage: `url(${data.img})`}}
      ></div>
    </div>
  )
}