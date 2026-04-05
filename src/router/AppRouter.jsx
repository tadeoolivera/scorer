import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from '../pages/Home.jsx'
import Conga from '../pages/Conga.jsx'
import Póker from '../pages/Póker.jsx'

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/conga' element={<Conga/>}/>
        <Route path='/póker' element={<Póker/>}/>
      </Routes>
    </Router>
  )
}

export default AppRouter