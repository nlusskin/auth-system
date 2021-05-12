import React from 'react'

import Loading from '@components/Loading';
import { useAPI } from '@hooks/useAPI'
import AuthContext from '@providers/Auth'

export default function Settings() {

  const { authState } = React.useContext(AuthContext)
  const { data, call } = useAPI('settings');
  const [success, setSuccess] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
  const [error, setError] = React.useState('');


  function handleSubmit(e) {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      return setError('Passwords do not match');
    }
    call({
      password: {
        currentPassword: currentPassword,
        newPassword: newPassword,
      }
    })
  }

  React.useEffect(() => {
    if (!data) return;
    if (data.error) return setError(data.error);
    if (data.success) return setSuccess(true)
  }, [data]);


  return (
    <div className='w-1/4 h-2/3 mx-auto mt-48'>
      <p>{'Email: ' + authState.user.userId}</p>

      <p>Update password:</p>
      <form onSubmit={handleSubmit}>
        <input
          type='password'
          placeholder='current password'
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          className='border-gray-300 border w-full rounded-md shadow-md p-2 m-2'
          required
          />
        <input
          type='password'
          placeholder='new password'
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className='border-gray-300 border w-full rounded-md shadow-md p-2 m-2'
          required
        />
        <input
          type='password'
          placeholder='confirm new password'
          value={confirmNewPassword}
          onChange={e => setConfirmNewPassword(e.target.value)}
          className='border-gray-300 border w-full rounded-md shadow-md p-2 m-2'
          required
        />
        <input
          type='submit'
          value={success ? 'Success!' : 'Change Password'}
          className={`w-full rounded-md ${success ? 'bg-green-600' : 'bg-blue-500'} text-white m-2 p-2`}
        />
        <p className='text-red-600 font-bold px-2'>{error}</p>
      </form>
    </div>
  )
}