import ArenaPage from '../components/ArenaPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<ArenaPage />}/>
      </Routes>
    </Router>
  )
}

export default App
