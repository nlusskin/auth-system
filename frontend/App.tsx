import React from 'react'
import ReactDOM from 'react-dom'

import './tailwind.css'

function App() {
  return <div>React working</div>
}

const domContainer = document.querySelector('#emd-root')
ReactDOM.render(React.createElement(App), domContainer)