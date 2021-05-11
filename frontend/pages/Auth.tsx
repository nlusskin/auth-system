import React from 'react'
import { useAPI } from '../hooks/useAPI'


export default function Auth() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const formRef = React.useRef<HTMLFormElement>(null)
  
  const { data, call } = useAPI('authenticate');

  function handleSubmit(e) {
    e.preventDefault();
    call({
      email: email,
      password: password
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type='email' placeholder='email' value={email} onChange={e => setEmail(e.target.value)} />
        <input type='password' placeholder='password' value={password} onChange={e => setPassword(e.target.value)} />
        <input type='submit' />
      </form>
    </div>
  )
}
