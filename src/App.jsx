import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Short from './short'
import Unshort from './Unshort'
import Redirect from './redirect'
import TextShare from './Textshare'
import TextView from './Textview'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path='/' element={<Short />} />
            <Route path='/short' element={<Short />} />
            <Route path='/unshort' element={<Unshort />} />
            <Route path='/:shortCode' element={<Redirect />} />
            <Route path='/text' element={<TextShare />} />
            <Route path='/text/:shortCode' element={<TextView />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App;