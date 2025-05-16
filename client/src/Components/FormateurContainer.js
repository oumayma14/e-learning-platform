import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import FormateurDashboard from "./FormateurDashboard";
import FormateurAddQuiz from './FormateurAddQuiz';
import FormateurNavbar from './FormateurNavbar';
import FormateurProfile from './FormateurProfile';
import { Navigate } from 'react-router-dom';
import { getStoredFormateur } from '../services/formateurService';

export const FormateurContainer = () => {
    const formateur = getStoredFormateur();

    if (!formateur) {
      return <Navigate to="/formateur" />;
    }

    return(
        <div style={{minHeight:'90.6vh'}}>
            <FormateurNavbar />
            <Routes>
                <Route path="/" element={<FormateurDashboard />} />
                <Route path="add-quiz" element={<FormateurAddQuiz />} />
                <Route path="profile" element={<FormateurProfile />} />
            </Routes>
        </div>
    );
};
