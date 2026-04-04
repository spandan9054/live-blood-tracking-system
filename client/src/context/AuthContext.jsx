import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Auth Synchronizer Failure:", e);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const loginUser = async (email, password) => {
    const { data } = await api.post('/auth/login-user', { email, password });
    const token = data.access_token || data.token;
    const user = data.user || data;
    
    if (token) localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    setUser(user);
    return data;
  };

  const loginHospital = async (email, password) => {
    const { data } = await api.post('/auth/login-hospital', { email, password });
    const token = data.access_token || data.token;
    const user = data.user || data;

    if (token) localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setUser(user);
    return data;
  };

  const registerUser = async (userData) => {
    const { data } = await api.post('/auth/register-user', userData);
    const token = data.access_token || data.token;
    const user = data.user || data;

    if (token) localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setUser(user);
    return data;
  };

  const registerHospital = async (hospitalData) => {
    const { data } = await api.post('/auth/register-hospital', hospitalData);
    const token = data.access_token || data.token;
    const user = data.user || data;

    if (token) localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setUser(user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, loginHospital, registerUser, registerHospital, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
