import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Connect } from './Components/Connect';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import "./App.css"
import { Inscrire } from './Components/Inscrire';
import { Apprenant } from './Components/Apprenant';

function App() {
  return(
    <Router>
      <Routes>
        <Route path='/' element={<Connect />} />
        <Route path='/dashboard' element={<Apprenant />} />
        <Route path="/inscrire" element={<Inscrire />} />
      </Routes>
    </Router>
  )
}

export default App;
