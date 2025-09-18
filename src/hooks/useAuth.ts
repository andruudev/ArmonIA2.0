import { useState, useEffect, createContext, useContext } from 'react';
import { AuthService } from '@/services/authService';

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
  completeOnboarding: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<User, 'name'>>) => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Enhanced authentication logic with secure password handling
export const useAuthLogic = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load current user on app start
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const loggedInUser = await AuthService.login(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      console.error('Login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = await AuthService.signup(email, password, name);
      setUser(newUser);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la cuenta';
      setError(errorMessage);
      console.error('Signup error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async (): Promise<void> => {
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }

    try {
      await AuthService.completeOnboarding(user.id);
      setUser(prev => prev ? { ...prev, onboardingCompleted: true } : null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al completar onboarding';
      setError(errorMessage);
      console.error('Complete onboarding error:', err);
      throw err;
    }
  };

  const updateProfile = async (updates: Partial<Pick<User, 'name'>>): Promise<void> => {
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }

    try {
      const updatedUser = await AuthService.updateUserProfile(user.id, updates);
      setUser(updatedUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar perfil';
      setError(errorMessage);
      console.error('Update profile error:', err);
      throw err;
    }
  };

  const logout = () => {
    try {
      AuthService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      // Even if there's an error, we should clear the user state
      setUser(null);
      setError(null);
    }
  };

  // Clear error after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    user,
    login,
    signup,
    logout,
    isLoading,
    completeOnboarding,
    updateProfile,
    error,
  };
};

export { AuthContext };