import axios from 'axios';

const API_URL = 'http://localhost:3002/api/formateur';

// ✅ Inscription d’un formateur
export const registerFormateur = async (formateurData) => {
    const payload = {
      nom: formateurData.name,
      email: formateurData.email,
      mot_de_passe: formateurData.password
    };
  
    const response = await axios.post(`${API_URL}/register`, payload);
    const user = response.data.user;
  
    if (user) {
      localStorage.setItem('formateurUser', JSON.stringify(user));
    }
  
    return response.data;
  };
  

// ✅ Connexion d’un formateur
export const loginFormateur = async (formateurData) => {
  const response = await axios.post(`${API_URL}/login`, formateurData);
  const token = response.data.token;
  const user = response.data.user;

  if (token && user) {
    localStorage.setItem('formateurToken', token);
    localStorage.setItem('formateurUser', JSON.stringify(user));
  }

  return response.data;
};

// ✅ Récupérer le token actuel
export const getFormateurToken = () => {
  return localStorage.getItem('formateurToken');
};

// ✅ Supprimer le token à la déconnexion
export const logoutFormateur = () => {
  localStorage.removeItem('formateurToken');
  localStorage.removeItem('formateurUser');
};

// ✅ Récupérer l'utilisateur formateur stocké en toute sécurité
export const getStoredFormateur = () => {
  const data = localStorage.getItem('formateurUser');

  if (!data || data === 'undefined') return null;

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Erreur JSON.parse sur formateurUser:', error);
    return null;
  }
};

// ✅ (Optionnel) Vérifier s’il y a un formateur connecté
export const isFormateurAuthenticated = () => {
  const token = getFormateurToken();
  const user = getStoredFormateur();
  return !!(token && user);
};
