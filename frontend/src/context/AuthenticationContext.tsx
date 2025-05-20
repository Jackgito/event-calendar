import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export type UserRole = 'admin' | 'user' | 'guest';

interface AuthenticationContextType {
  role: UserRole;
  getUserRole: () => UserRole;
  isAdmin: boolean;
  isUser: boolean;
  isGuest: boolean;
  isLoggedIn: boolean;
  setRole: (role: UserRole) => void;
}

const AuthenticationContext = createContext<AuthenticationContextType | undefined>(undefined);

export const AuthenticationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('guest');

  useEffect(() => {
    // Example: check local storage for a JWT
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setRole(decoded.role); // assuming your JWT has { role: 'admin' | 'user' }
      } catch (err) {
        console.error("Invalid token:", err);
        setRole('guest');
      }
    }
  }, []);

  const isLoggedIn = role !== 'guest';

  const contextValue: AuthenticationContextType = {
    role,
    getUserRole: () => role,
    isAdmin: role === 'admin',
    isUser: role === 'user',
    isGuest: role === 'guest',
    isLoggedIn,
    setRole,
  };

  return (
    <AuthenticationContext.Provider value={contextValue}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = (): AuthenticationContextType => {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error('useAuthentication must be used within an AuthenticationProvider');
  }
  return context;
};
