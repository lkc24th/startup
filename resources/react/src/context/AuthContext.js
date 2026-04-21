import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchUser();
    }
  }, []);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await authAPI.getUser();
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (err) {
      localStorage.removeItem('auth_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.login({ username, password });
      if (response.data.success) {
        const { user, token } = response.data.data;
        localStorage.setItem('auth_token', token);
        setUser(user);
        return user;
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Đăng nhập thất bại';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, username, password, passwordConfirm, phone, role) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.register({
        name,
        username,
        password,
        password_confirmation: passwordConfirm,
        phone,
        role
      });
      if (response.data.success) {
        const { user, token } = response.data.data;
        localStorage.setItem('auth_token', token);
        setUser(user);
        return user;
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Đăng ký thất bại';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authAPI.logout();
      localStorage.removeItem('auth_token');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
