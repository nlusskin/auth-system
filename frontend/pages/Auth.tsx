import React from 'react'
import { useAPI } from '../hooks/useAPI'

import AuthProvider from '@providers/Auth'

export default function Auth() {
  const [loading, setLoading] = React.useState(false);
  const [signup, setSignup] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const { checkAuthState } = React.useContext(AuthProvider);
  const { data, call } = useAPI('authenticate');

  function handleSubmit(e) {
    e.preventDefault();
    if (signup && password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    call({
      email: email,
      password: password,
      create: !!signup
    })
  }

  React.useEffect(() => {
    if (!data) return;
    if (data.error) return setError('Invalid login. Please try again');
    checkAuthState();
  }, [data]);

  return (
    <div className='w-1/4 h-1/2 mx-auto vertical-center'>
      <h1
        className={`text-3xl px-2 inline cursor-pointer ${signup ? 'text-gray-400' : ''}`}
        onClick={() => setSignup(false)}
        >
        Login
      </h1>
      <h1
        className={`text-3xl px-2 inline cursor-pointer ${!signup ? 'text-gray-400' : ''}`}
        onClick={() => setSignup(true)}
      >
        Signup
      </h1>
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          placeholder='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          className='border-gray-300 border w-full rounded-md shadow-md p-2 m-2'
          required
          />
        <input
          type='password'
          placeholder='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          className='border-gray-300 border w-full rounded-md shadow-md p-2 m-2'
          required
          />
        {signup && <input
          type='password'
          placeholder='confirm password'
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className='border-gray-300 border w-full rounded-md shadow-md p-2 m-2'
          required
        />}
        <input
          type='submit'
          value='Login'
          className='w-full rounded-md bg-blue-500 text-white m-2 p-2'
        />
        <p className='text-red-600 font-bold px-2'>{error}</p>
      </form>
    </div>
  )
}
