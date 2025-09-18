import bcrypt from 'bcryptjs';
import { User } from '@/hooks/useAuth';

export interface StoredUser {
  id: string;
  email: string;
  hashedPassword: string;
  name: string;
  onboardingCompleted: boolean;
  createdAt: string;
  lastLogin?: string;
}

const SALT_ROUNDS = 12;
const USERS_KEY = 'armonia_users';
const CURRENT_USER_KEY = 'armonia_user';

export class AuthService {
  private static getStoredUsers(): StoredUser[] {
    try {
      const users = localStorage.getItem(USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error parsing stored users:', error);
      return [];
    }
  }

  private static saveUsers(users: StoredUser[]): void {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
      throw new Error('No se pudo guardar la información del usuario');
    }
  }

  private static saveCurrentUser(user: User): void {
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving current user:', error);
      throw new Error('No se pudo guardar la sesión del usuario');
    }
  }

  static getCurrentUser(): User | null {
    try {
      const user = localStorage.getItem(CURRENT_USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing current user:', error);
      return null;
    }
  }

  static async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, SALT_ROUNDS);
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Error al procesar la contraseña');
    }
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  static async login(email: string, password: string): Promise<User | null> {
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }

    const users = this.getStoredUsers();
    const storedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!storedUser) {
      throw new Error('Usuario no encontrado');
    }

    const isValidPassword = await this.verifyPassword(password, storedUser.hashedPassword);
    if (!isValidPassword) {
      throw new Error('Contraseña incorrecta');
    }

    // Update last login
    storedUser.lastLogin = new Date().toISOString();
    this.saveUsers(users);

    const user: User = {
      id: storedUser.id,
      email: storedUser.email,
      name: storedUser.name,
      onboardingCompleted: storedUser.onboardingCompleted
    };

    this.saveCurrentUser(user);
    return user;
  }

  static async signup(email: string, password: string, name: string): Promise<User> {
    if (!email || !password || !name) {
      throw new Error('Todos los campos son requeridos');
    }

    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    const users = this.getStoredUsers();
    
    // Check if user already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Ya existe un usuario con este email');
    }

    const hashedPassword = await this.hashPassword(password);
    
    const newStoredUser: StoredUser = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      hashedPassword,
      name: name.trim(),
      onboardingCompleted: false,
      createdAt: new Date().toISOString()
    };

    users.push(newStoredUser);
    this.saveUsers(users);

    const user: User = {
      id: newStoredUser.id,
      email: newStoredUser.email,
      name: newStoredUser.name,
      onboardingCompleted: false
    };

    this.saveCurrentUser(user);
    return user;
  }

  static logout(): void {
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  static async completeOnboarding(userId: string): Promise<void> {
    const users = this.getStoredUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('Usuario no encontrado');
    }

    users[userIndex].onboardingCompleted = true;
    this.saveUsers(users);

    // Update current user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const updatedUser = { ...currentUser, onboardingCompleted: true };
      this.saveCurrentUser(updatedUser);
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<Pick<User, 'name'>>): Promise<User> {
    const users = this.getStoredUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('Usuario no encontrado');
    }

    if (updates.name) {
      users[userIndex].name = updates.name.trim();
    }

    this.saveUsers(users);

    // Update current user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const updatedUser = { ...currentUser, ...updates };
      this.saveCurrentUser(updatedUser);
      return updatedUser;
    }

    throw new Error('Error al actualizar el perfil');
  }
}
