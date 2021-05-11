import React from 'react'
import ReactDOM from 'react-dom'

import Header from '@components/Header'
import Loading from '@components/Loading'
import Auth from '@pages/Auth'
import Welcome from '@pages/Welcome'
import AuthContext, { AuthProvider } from '@providers/Auth'

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
  const authed = authState.authed;

  if (!authState.loaded) return <div className='w-1/4 h-1/4 vertical-center mx-auto'><Loading /></div>

  return (
    <div className='w-full h-full overflow-hidden'>
      {authed && <Header />}
      {!authed && <Auth />}
      {authed && <Welcome />}
    </div>
  )
}

const domContainer = document.querySelector('#emd-root')
ReactDOM.render(React.createElement(App), domContainer)