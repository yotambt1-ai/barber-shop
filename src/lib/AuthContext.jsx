import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This is where you would check for an existing session token (e.g., in localStorage)
    // and validate it with your backend to authenticate the user.
    const checkUserAuth = async () => {
      try {
        // Example: const user = await myAuthApiClient.me();
        // setUser(user);
        // setIsAuthenticated(true);
      } catch (error) {
        // Not authenticated
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAuth();
  }, []);

  const login = async (credentials) => {
    // Placeholder for your login logic
    // const user = await myAuthApiClient.login(credentials);
    // setUser(user);
    // setIsAuthenticated(true);
  };

  const logout = () => {
    // Placeholder for your logout logic
    setUser(null);
    setIsAuthenticated(false);
    // Remove token from localStorage
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading,
      login,
      logout,
    }}>
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
