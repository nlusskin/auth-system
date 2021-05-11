import React from 'react'
import ReactDOM from 'react-dom'
import { useAPI } from './hooks/useAPI'

import './tailwind.css'



function App() {
  const [token, setToken] = React.useState('')

  const {data, call } = useAPI('authenticate');
  React.useEffect(() => call({email: 'nick@lussk.in'}), [])

  return <div>{JSON.stringify(data)}</div>
}

const domContainer = document.querySelector('#emd-root')
ReactDOM.render(React.createElement(App), domContainer)