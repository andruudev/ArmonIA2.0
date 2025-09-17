import { useState, useEffect, createContext, useContext } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  onboardingCompleted?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock authentication logic with localStorage
export const useAuthLogic = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('armonia_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('armonia_users') || '[]');
    const existingUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (existingUser) {
      const userData: User = { 
        id: existingUser.id, 
        email: existingUser.email, 
        name: existingUser.name,
        onboardingCompleted: !!existingUser.onboardingCompleted,
      };
      setUser(userData);
      localStorage.setItem('armonia_user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('armonia_users') || '[]');
    if (users.find((u: any) => u.email === email)) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser = { 
      id: Date.now().toString(), 
      email, 
      password, 
      name,
      onboardingCompleted: false,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('armonia_users', JSON.stringify(users));
    
    const userData: User = { id: newUser.id, email: newUser.email, name: newUser.name, onboardingCompleted: false };
    setUser(userData);
    localStorage.setItem('armonia_user', JSON.stringify(userData));
    
    setIsLoading(false);
    return true;
  };

  const completeOnboarding = () => {
    if (!user) return;
    const updated: User = { ...user, onboardingCompleted: true };
    setUser(updated);
    localStorage.setItem('armonia_user', JSON.stringify(updated));

    // also update the stored users list
    const users = JSON.parse(localStorage.getItem('armonia_users') || '[]');
    const idx = users.findIndex((u: any) => u.id === user.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], onboardingCompleted: true };
      localStorage.setItem('armonia_users', JSON.stringify(users));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('armonia_user');
  };

  return {
    user,
    login,
    signup,
    logout,
    isLoading,
    completeOnboarding,
  };
};

export { AuthContext };