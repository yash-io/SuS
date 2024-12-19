import { useState } from 'react'
import {BrowserRouter as Router, Route,Routes} from 'react-router-dom'
import Short from './short'
import Unshort from './Unshort'
import Redirect from './redirect'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Router>
          <Routes> 
              <Route path='/' element={<Short/>} ></Route>      
              <Route path='/short' element={<Short/>} ></Route>
              <Route path='/unshort' element={<Unshort/>} ></Route>
              <Route path='/:shortCode' element={<Redirect/>} ></Route>
          </Routes>

        </Router>
      </div>
    </>
  )
}

export default App
