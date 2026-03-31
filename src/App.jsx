import AppRouter from './router/AppRouter.jsx'
import './App.css'

const App = () => {
  return (
    <div className='main'>
      <AppRouter/>
      <span className="app-credit">Desarrollado por <a href="https://github.com/tadeoolivera" target="_blank" rel="noopener noreferrer">Tadeo Olivera</a></span>
    </div>
  )
}

export default App