'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import callApi from '../utils/callApi';

interface UserContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  loading: boolean;
  checkUserStatus: () => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const checkUserStatus = async () => {
    setLoading(true);
    try {
      const response = await callApi<string>('GET', '/auth/check-login');
      
      if (response.status === 200 && response.data) {
        const userStatus = response.data;
        
        if (userStatus === "ADMIN") {
          setIsLoggedIn(true);
          setIsAdmin(true);
        } else if (userStatus === "USER") {
          setIsLoggedIn(true);
          setIsAdmin(false);
        } else if (userStatus === "NOT-LOGGED-IN") {
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      setIsLoggedIn(false);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  const contextValue: UserContextType = {
    isLoggedIn,
    isAdmin,
    loading,
    checkUserStatus,
    logout
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
