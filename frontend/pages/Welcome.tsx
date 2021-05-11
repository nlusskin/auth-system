import React from 'react'
import { useAPI } from '../hooks/useAPI'


export default function Welcome() {

  const {data, call } = useAPI('authenticate');
  React.useEffect(() => call({email: 'nick@lussk.in', password: 'abc123'}), [])

  return (
    <div>
      <a href='/logout'>Logout</a>
    </div>
  )
}