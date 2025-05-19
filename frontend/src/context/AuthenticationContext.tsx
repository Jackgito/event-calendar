import React, { createContext, useContext } from 'react';

// Define possible roles
export type UserRole = 'admin' | 'user' | 'guest';

// Context value type
interface AuthenticationContextType {
  role: UserRole;
  getUserRole: () => UserRole;
  isAdmin: boolean;
  isUser: boolean;
  isGuest: boolean;
}

// Placeholder logic (replace with real auth check later)
const DEFAULT_USER_ROLE = 'admin' as UserRole;

// Create context
const AuthenticationContext = createContext<AuthenticationContextType | undefined>(undefined);

// Provider
export const AuthenticationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const role: UserRole = DEFAULT_USER_ROLE;

  const contextValue: AuthenticationContextType = {
    role,
    getUserRole: () => role,
    isAdmin: role === 'admin',
    isUser: role === 'user',
    isGuest: role === 'guest',
  };

  return (
    <AuthenticationContext.Provider value={contextValue}>
      {children}
    </AuthenticationContext.Provider>
  );
};

// Hook to use the context
export const useAuthentication = (): AuthenticationContextType => {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error('useAuthentication must be used within an AuthenticationProvider');
  }
  return context;
};
