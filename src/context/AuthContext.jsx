
import React, {
  createContext,
  useState,
  useEffect,
  useContext
} from 'react';

import { api } from '../services/api';

const AuthContext = createContext();

const EXPECTED_ROLE = 'cutting';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const decodeJWT = (jwt) => {
    try {
      const payload = jwt.split('.')[1];
      const base64 = payload
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      return JSON.parse(atob(base64));
    } catch (error) {
      console.error('JWT decoding failed:', error);
      return null;
    }
  };

  const logout = () => {
    api.clearCache();

    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Validate the existing session when the application loads.
  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const decoded = decodeJWT(token);

    if (
      decoded &&
      decoded.exp &&
      decoded.exp * 1000 > Date.now() &&
      decoded.role?.toLowerCase() === EXPECTED_ROLE
    ) {
      setUser(decoded);
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }

    setLoading(false);
  }, [token]);

  // Login
  const login = async (username, password) => {
    try {
      // Clear previous session
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);

      const response = await api.post(
        '/admin/auth/login/',
        { username, password }
      );

      if (!response.access) {
        return {
          success: false,
          error: 'Invalid username or password.'
        };
      }

      const decoded = decodeJWT(response.access);

      if (
        !decoded ||
        !decoded.exp ||
        decoded.exp * 1000 <= Date.now()
      ) {
        return {
          success: false,
          error: 'Invalid or expired login token.'
        };
      }

      // Validate Accounts role
      if (decoded.role?.toLowerCase() !== EXPECTED_ROLE) {
        return {
          success: false,
          error: 'This is not a Cutting account. Please use the correct login portal.'
        };
      }

      // Save session only after role validation
      localStorage.setItem('token', response.access);
      setToken(response.access);
      setUser(decoded);

      return { success: true };

    } catch (error) {
      console.error('Login error:', error);

      const message = error.message?.toLowerCase() || '';

      if (
        message.includes('no active account') ||
        message.includes('invalid credentials') ||
        message.includes('401') ||
        message.includes('credential')
      ) {
        return {
          success: false,
          error: 'Invalid username or password. Please try again.'
        };
      }

      return {
        success: false,
        error: 'Unable to log in. Please try again later.'
      };
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
