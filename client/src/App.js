import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Connect } from './Components/Connect';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import "./App.css"
import { Inscrire } from './Components/Inscrire';
import { Apprenant } from './Components/Apprenant'; 
import { Container } from './Components/Container';
import { Footer } from './Components/Footer';
import { Contact } from './Components/Contact';
import { AuthProvider } from './context/AuthContext';
import FormateurAuth from './Components/FormateurAuth';
import { FormateurContainer } from './Components/FormateurContainer';
function App() {
  return(
    <AuthProvider>
    <Router>
      <Routes>
      <Route path='/' element={<Container />} />
        <Route path='/connecter' element={<Connect />} />
        <Route path='/dashboard/*' element={<Apprenant />} />
        <Route path="/inscrire" element={<Inscrire />} />
        <Route path='/contact' element= {<Contact/>} />
        <Route path="/formateur" element={<FormateurAuth />} />
      <Route path="/formateur/dashboard/*" element={<FormateurContainer />} />

      </Routes>
      <Footer />
    </Router>
    </AuthProvider>
  )
}
export default App;
