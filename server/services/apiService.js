import Axios from 'axios';

const API_BASE_URL = 'http://localhost:3002';

//registrationService
export const registerUser = async (data) => {
  try {
    const response = await Axios.post(`${API_BASE_URL}/register`, data, {
      headers: { 
        "Content-Type": "multipart/form-data",
      },
      timeout: 10000 
    });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error; 
  }
};

 //loginService
export const loginUser = async (email, password) => {
  try {
    const response = await Axios.post(`${API_BASE_URL}/login`, {
      LoginEmail: email.trim(),
      LoginPassword: password.trim()
    });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error; 
  }
};
