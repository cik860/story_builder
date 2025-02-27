// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import twitterService from '../services/twitter.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('twitter_token');
      if (token) {
        twitterService.setAccessToken(token);
        const userProfile = await twitterService.getUserProfile();
        setUser(userProfile);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    // In a real app, this would redirect to Twitter OAuth
    window.location.href = '/api/auth/twitter';
  };

  const logout = () => {
    localStorage.removeItem('twitter_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};