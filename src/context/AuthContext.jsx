import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const decodeJWT = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser(decoded);
        localStorage.setItem('token', token);
      } else {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    try {
      // Need to use native fetch or an unauthenticated api call here,
      // because our api.js interceptor might get confused if we don't have a token yet
      // but it's fine since api.js uses standard fetch.
      const response = await api.post('/admin/auth/login/', { username, password });
      if (response.access) {
        setToken(response.access);
        const decoded = decodeJWT(response.access);
        setUser(decoded);
        localStorage.setItem('token', response.access);
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-900">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
