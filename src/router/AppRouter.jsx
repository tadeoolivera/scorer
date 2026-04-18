import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from '../pages/Home.jsx'
import Conga from '../pages/Conga/index.jsx'
import Poker from '../pages/Poker/index.jsx'

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/conga' element={<Conga/>}/>
        <Route path='/poker' element={<Poker/>}/>
      </Routes>
    </Router>
  )
}

export default AppRouter