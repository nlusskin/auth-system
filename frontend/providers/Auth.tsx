import React from 'react'

import { useAPI } from '../hooks/useAPI'

const form = {
    loaded: false,
    user: {} as User,
    authed: false,
    error: false
  }

const AuthContext = React.createContext({
  authState: form,
  checkAuthState: () => { }
})
export default AuthContext

export function AuthProvider(p:any) {

  const [authState, setAuthState] = React.useState(form)

  const {data: jwtpl, call} = useAPI<JWT>('authenticate')

  async function assess() {
    if (!jwtpl) return
    console.log(jwtpl)
    if (jwtpl.error) return setAuthState({...authState, loaded: true, error: true})
    
    let tmp = {
      loaded: true,
      user: {userId: jwtpl.sub},
      authed: !!jwtpl.sub,
      error: false
    }
    setAuthState(tmp)
  }
  
  React.useEffect(() => {
    assess()
  }, [jwtpl])

  React.useEffect(() => {
    call()
  }, [])

  return (
    <AuthContext.Provider value={{authState: authState, checkAuthState: call}}>
      {p.children}
    </AuthContext.Provider>
  )
}