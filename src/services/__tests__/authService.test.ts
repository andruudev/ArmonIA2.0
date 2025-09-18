import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from '../authService';

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashedPassword123'),
    compare: vi.fn().mockImplementation((password, hash) => {
      return Promise.resolve(password === 'correctPassword' && hash === 'hashedPassword123');
    }),
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash a password successfully', async () => {
      const password = 'testPassword123';
      const hashedPassword = await AuthService.hashPassword(password);
      
      expect(hashedPassword).toBe('hashedPassword123');
    });

    it('should throw error for invalid password', async () => {
      const bcrypt = await import('bcryptjs');
      vi.mocked(bcrypt.default.hash).mockRejectedValueOnce(new Error('Hash error'));

      await expect(AuthService.hashPassword('test')).rejects.toThrow('Error al procesar la contraseña');
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const result = await AuthService.verifyPassword('correctPassword', 'hashedPassword123');
      expect(result).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const result = await AuthService.verifyPassword('wrongPassword', 'hashedPassword123');
      expect(result).toBe(false);
    });

    it('should handle verification errors gracefully', async () => {
      const bcrypt = await import('bcryptjs');
      vi.mocked(bcrypt.default.compare).mockRejectedValueOnce(new Error('Compare error'));

      const result = await AuthService.verifyPassword('test', 'hash');
      expect(result).toBe(false);
    });
  });

  describe('signup', () => {
    it('should create a new user successfully', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const name = 'Test User';

      const user = await AuthService.signup(email, password, name);

      expect(user).toEqual({
        id: expect.any(String),
        email: email.toLowerCase(),
        name: name.trim(),
        onboardingCompleted: false,
      });

      // Check if user was stored
      const storedUsers = JSON.parse(localStorage.getItem('armonia_users') || '[]');
      expect(storedUsers).toHaveLength(1);
      expect(storedUsers[0].email).toBe(email.toLowerCase());
    });

    it('should throw error for missing fields', async () => {
      await expect(AuthService.signup('', 'password', 'name')).rejects.toThrow('Todos los campos son requeridos');
      await expect(AuthService.signup('email@test.com', '', 'name')).rejects.toThrow('Todos los campos son requeridos');
      await expect(AuthService.signup('email@test.com', 'password', '')).rejects.toThrow('Todos los campos son requeridos');
    });

    it('should throw error for short password', async () => {
      await expect(AuthService.signup('test@example.com', '123', 'Test User')).rejects.toThrow('La contraseña debe tener al menos 6 caracteres');
    });

    it('should throw error for duplicate email', async () => {
      const email = 'test@example.com';
      
      // Create first user
      await AuthService.signup(email, 'password123', 'Test User 1');
      
      // Try to create second user with same email
      await expect(AuthService.signup(email, 'password456', 'Test User 2')).rejects.toThrow('Ya existe un usuario con este email');
    });

    it('should handle case-insensitive email duplicates', async () => {
      await AuthService.signup('test@example.com', 'password123', 'Test User 1');
      
      await expect(AuthService.signup('TEST@EXAMPLE.COM', 'password456', 'Test User 2')).rejects.toThrow('Ya existe un usuario con este email');
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      // Create a test user
      await AuthService.signup('test@example.com', 'correctPassword', 'Test User');
    });

    it('should login successfully with correct credentials', async () => {
      const user = await AuthService.login('test@example.com', 'correctPassword');

      expect(user).toEqual({
        id: expect.any(String),
        email: 'test@example.com',
        name: 'Test User',
        onboardingCompleted: false,
      });

      // Check if current user was stored
      const currentUser = AuthService.getCurrentUser();
      expect(currentUser).toEqual(user);
    });

    it('should throw error for missing credentials', async () => {
      await expect(AuthService.login('', 'password')).rejects.toThrow('Email y contraseña son requeridos');
      await expect(AuthService.login('email@test.com', '')).rejects.toThrow('Email y contraseña son requeridos');
    });

    it('should throw error for non-existent user', async () => {
      await expect(AuthService.login('nonexistent@example.com', 'password')).rejects.toThrow('Usuario no encontrado');
    });

    it('should throw error for incorrect password', async () => {
      await expect(AuthService.login('test@example.com', 'wrongPassword')).rejects.toThrow('Contraseña incorrecta');
    });

    it('should handle case-insensitive email login', async () => {
      const user = await AuthService.login('TEST@EXAMPLE.COM', 'correctPassword');
      expect(user?.email).toBe('test@example.com');
    });

    it('should update last login timestamp', async () => {
      await AuthService.login('test@example.com', 'correctPassword');
      
      const storedUsers = JSON.parse(localStorage.getItem('armonia_users') || '[]');
      const user = storedUsers.find((u: any) => u.email === 'test@example.com');
      
      expect(user.lastLogin).toBeDefined();
      expect(new Date(user.lastLogin)).toBeInstanceOf(Date);
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user is logged in', () => {
      const user = AuthService.getCurrentUser();
      expect(user).toBeNull();
    });

    it('should return current user when logged in', async () => {
      await AuthService.signup('test@example.com', 'password123', 'Test User');
      const user = AuthService.getCurrentUser();
      
      expect(user).toEqual({
        id: expect.any(String),
        email: 'test@example.com',
        name: 'Test User',
        onboardingCompleted: false,
      });
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('armonia_user', 'invalid json');
      const user = AuthService.getCurrentUser();
      expect(user).toBeNull();
    });
  });

  describe('logout', () => {
    it('should clear current user data', async () => {
      await AuthService.signup('test@example.com', 'password123', 'Test User');
      expect(AuthService.getCurrentUser()).not.toBeNull();
      
      AuthService.logout();
      expect(AuthService.getCurrentUser()).toBeNull();
    });
  });

  describe('completeOnboarding', () => {
    it('should mark onboarding as completed', async () => {
      const user = await AuthService.signup('test@example.com', 'password123', 'Test User');
      
      await AuthService.completeOnboarding(user.id);
      
      const updatedUser = AuthService.getCurrentUser();
      expect(updatedUser?.onboardingCompleted).toBe(true);
      
      // Check stored users list
      const storedUsers = JSON.parse(localStorage.getItem('armonia_users') || '[]');
      const storedUser = storedUsers.find((u: any) => u.id === user.id);
      expect(storedUser.onboardingCompleted).toBe(true);
    });

    it('should throw error for non-existent user', async () => {
      await expect(AuthService.completeOnboarding('nonexistent')).rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      const user = await AuthService.signup('test@example.com', 'password123', 'Test User');
      
      const updatedUser = await AuthService.updateUserProfile(user.id, { name: 'Updated Name' });
      
      expect(updatedUser.name).toBe('Updated Name');
      
      // Check current user
      const currentUser = AuthService.getCurrentUser();
      expect(currentUser?.name).toBe('Updated Name');
      
      // Check stored users list
      const storedUsers = JSON.parse(localStorage.getItem('armonia_users') || '[]');
      const storedUser = storedUsers.find((u: any) => u.id === user.id);
      expect(storedUser.name).toBe('Updated Name');
    });

    it('should trim whitespace from name', async () => {
      const user = await AuthService.signup('test@example.com', 'password123', 'Test User');
      
      const updatedUser = await AuthService.updateUserProfile(user.id, { name: '  Trimmed Name  ' });
      
      expect(updatedUser.name).toBe('Trimmed Name');
    });

    it('should throw error for non-existent user', async () => {
      await expect(AuthService.updateUserProfile('nonexistent', { name: 'New Name' })).rejects.toThrow('Usuario no encontrado');
    });
  });
});
