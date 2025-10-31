import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Load artist data on mount if token exists
  useEffect(() => {
    const loadArtist = async () => {
      if (token) {
        try {
          const response = await authAPI.getMe();
          setArtist(response.data.artist);
        } catch (error) {
          console.error('Failed to load artist:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    loadArtist();
  }, [token]);

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { token, artist } = response.data;
    
    localStorage.setItem('token', token);
    setToken(token);
    setArtist(artist);
    
    return response.data;
  };

  const signup = async (userData) => {
    const response = await authAPI.signup(userData);
    const { token, artist } = response.data;
    
    localStorage.setItem('token', token);
    setToken(token);
    setArtist(artist);
    
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setArtist(null);
  };

  const updateArtist = (updatedData) => {
    setArtist((prev) => ({ ...prev, ...updatedData }));
  };

  const value = {
    artist,
    token,
    loading,
    login,
    signup,
    logout,
    updateArtist,
    isAuthenticated: !!token && !!artist,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
