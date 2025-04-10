import Axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002';

// Create axios instance with default config
const apiClient = Axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Enhanced request interceptor to include token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Enhanced response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Handle HTML error responses (like 404 pages)
      if (typeof error.response.data === 'string' && error.response.data.startsWith('<!DOCTYPE html>')) {
        return Promise.reject({
          message: 'Endpoint not found',
          status: error.response.status,
          response: 'The requested API endpoint does not exist',
        });
      }

      return Promise.reject({
        message: error.response.data?.message || 'Request failed',
        response: error.response.data,
        status: error.response.status,
      });
    } else if (error.request) {
      return Promise.reject({
        message: 'Network error - no response received',
      });
    } else {
      return Promise.reject({
        message: error.message || 'Error setting up request',
      });
    }
  }
);

// Authentication service
export const authService = {
  registerUser: async (formData) => {
    try {
      return await apiClient.post('/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  loginUser: async (credentials) => {
    try {
      const response = await apiClient.post('/login', credentials);
      if (response.token) {
        localStorage.setItem('token', response.token);
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user)); // Save user info
        }
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Fetches the currently logged-in user
  getCurrentUser: async () => {
    try {
      const endpoints = ['/api/user/me', '/user/me', '/users/me'];
      
      for (const endpoint of endpoints) {
        try {
          const response = await apiClient.get(endpoint);
          return response;  // Return the first successful response
        } catch (err) {
          if (err.response?.status !== 404) {
            throw err; // If it's not a 404 error, rethrow
          }
        }
      }

      throw new Error('User endpoint not found');
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw {
        message: error.message || 'Failed to fetch user data',
        status: error.status || 500,
        response: error.response,
      };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if user data is available in localStorage
  getStoredUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  }
};

// Leaderboard service
export const leaderboardService = {
  getLeaderboard: async () => {
    try {
      return await apiClient.get('/api/leaderboard');
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  },
};

// Utility function to check API health
export const checkApiHealth = async () => {
  try {
    await apiClient.get('/health');
    return true;
  } catch {
    return false;
  }
};

export default apiClient;
