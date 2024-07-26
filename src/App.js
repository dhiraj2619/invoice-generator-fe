import React from 'react'
import AllRoute from './AllRoute'
import Sidebar from './components/Sidebar'

const App = () => {
  return (
    <div className="d-flex flex-row">
      <Sidebar/>
      <AllRoute/>
    </div>
  )
}

export default App