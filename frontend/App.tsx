import React from 'react'
import ReactDOM from 'react-dom'

import Header from '@components/Header'
import Loading from '@components/Loading'
import Auth from '@pages/Auth'
import Settings from '@pages/Settings'
import Welcome from '@pages/Welcome'
import AuthContext, { AuthProvider } from '@providers/Auth'
import RouterContext, { RouterProvider } from '@providers/Router'

import './tailwind.css'

function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <Router />
      </RouterProvider>
    </AuthProvider>
  )
}

function Router() {
  const { authState } = React.useContext(AuthContext);
  const authed = authState.authed;

  const { page } = React.useContext(RouterContext);

  if (!authState.loaded) return <div className='w-1/4 h-1/4 vertical-center mx-auto'><Loading /></div>

  return (
    <div className='w-full h-full overflow-hidden'>
      {authed && <Header />}
      {!authed && <Auth />}
      {authed && page == 'welcome' && <Welcome />}
      {authed && page == 'settings' && <Settings />}
    </div>
  )
}

const domContainer = document.querySelector('#emd-root')
ReactDOM.render(React.createElement(App), domContainer)