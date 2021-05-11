import React from 'react'
import ReactDOM from 'react-dom'
import Loading from './components/Loading'
import Auth from './pages/Auth'
import Welcome from './pages/Welcome'
import AuthContext, { AuthProvider } from './providers/Auth'

import './tailwind.css'



function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  )
}

function Router() {
  const { authState } = React.useContext(AuthContext);

  if (!authState.loaded) return <Loading />

  return (
    <div>
      {!authState.authed && <Auth />}
      {authState.authed && <Welcome />}
    </div>
  )
}

const domContainer = document.querySelector('#emd-root')
ReactDOM.render(React.createElement(App), domContainer)