// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { validateToken, getUserData } from "../utilities/authUtils";

const AuthContext = createContext(null);
const TOKEN_KEY = 'jwtToken';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  const login = (token, userData) => {
    localStorage.setItem(TOKEN_KEY, token);
    setIsAuthenticated(true);
    setUser(userData);
    window.dispatchEvent(new Event('authChange'));
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
    setUser(null);
    window.dispatchEvent(new Event('authChange'));
  };

  useEffect(() => {
    // Check token validity on mount
    const checkToken = async () => {
      setLoading(true); // Start loading
      try {
        const isValid = await validateToken();
        setIsAuthenticated(isValid);
        
        if (isValid) {
          const userData = await getUserData();
          if (userData) {
            setUser(userData);
            console.log('Loaded user data from localStorage:', userData);
          } else {
            console.warn('Valid token but no user data found');
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false); // End loading regardless of outcome
      }
    };
    checkToken();

    // Listen for auth changes
    const handleAuthChange = async () => {
      setLoading(true); // Start loading during auth changes too
      try {
        const isValid = await validateToken();
        setIsAuthenticated(isValid);
        
        if (isValid) {
          const userData = await getUserData();
          if (userData) {
            setUser(userData);
            console.log('Auth change: loaded user data from localStorage:', userData);
          } else {
            console.warn('Auth change: valid token but no user data found');
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error during auth change:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false); // End loading
      }
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        setIsAuthenticated,
        user,
        setUser,
        login,
        logout,
        loading // Expose loading state to consumers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
