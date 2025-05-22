import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export type UserRole = 'ADMIN' | 'USER' | 'GUEST';

interface User {
  id: string;
  username: string;
  role: UserRole;
}

interface AuthenticationContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isUser: boolean;
  isGuest: boolean;
  getUserRole: () => UserRole;
}

const AuthenticationContext = createContext<AuthenticationContextType | undefined>(undefined);

export const AuthenticationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({
          id: decoded.id,
          username: decoded.username,
          role: decoded.role as UserRole,
        });
      } catch (err) {
        console.error("Invalid token:", err);
        setUser(null);
      }
    }
  }, []);

  const contextValue: AuthenticationContextType = {
    user,
    setUser,
    isLoggedIn: !!user && user.role !== 'GUEST',
    isAdmin: user?.role === 'ADMIN',
    isUser: user?.role === 'USER',
    isGuest: !user || user.role === 'GUEST',
    getUserRole: () => user?.role ?? 'GUEST',
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
