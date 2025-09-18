import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  signupSchema,
  profileSchema,
  moodEntrySchema,
  chatMessageSchema,
  contactSchema,
  onboardingSchema,
  validateEmail,
  validatePassword,
  sanitizeInput,
} from '../validations';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('email');
      }
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('6 caracteres');
      }
    });

    it('should reject empty fields', () => {
      const invalidData = {
        email: '',
        password: '',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe('signupSchema', () => {
    it('should validate correct signup data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      const result = signupSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid name with numbers', () => {
      const invalidData = {
        name: 'John123',
        email: 'john@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      const result = signupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject weak password', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password', // No uppercase or number
        confirmPassword: 'password',
      };

      const result = signupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('mayúscula');
      }
    });

    it('should reject mismatched passwords', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        confirmPassword: 'DifferentPassword123',
      };

      const result = signupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('no coinciden');
      }
    });

    it('should accept names with accents and ñ', () => {
      const validData = {
        name: 'José María Peña',
        email: 'jose@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      const result = signupSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('profileSchema', () => {
    it('should validate correct profile data', () => {
      const validData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
      };

      const result = profileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject too long name', () => {
      const invalidData = {
        name: 'A'.repeat(51), // 51 characters
        email: 'jane@example.com',
      };

      const result = profileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('moodEntrySchema', () => {
    it('should validate correct mood entry', () => {
      const validData = {
        mood: 'happy',
        journal: 'Feeling great today!',
        date: '2024-01-15',
      };

      const result = moodEntrySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate mood entry without journal', () => {
      const validData = {
        mood: 'neutral',
        date: '2024-01-15',
      };

      const result = moodEntrySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid date format', () => {
      const invalidData = {
        mood: 'happy',
        date: '15/01/2024', // Wrong format
      };

      const result = moodEntrySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject too long journal', () => {
      const invalidData = {
        mood: 'happy',
        journal: 'A'.repeat(1001), // 1001 characters
        date: '2024-01-15',
      };

      const result = moodEntrySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('chatMessageSchema', () => {
    it('should validate correct message', () => {
      const validData = {
        message: 'Hello, how are you?',
      };

      const result = chatMessageSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty message', () => {
      const invalidData = {
        message: '',
      };

      const result = chatMessageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject too long message', () => {
      const invalidData = {
        message: 'A'.repeat(1001),
      };

      const result = chatMessageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should trim whitespace', () => {
      const data = {
        message: '  Hello world  ',
      };

      const result = chatMessageSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.message).toBe('Hello world');
      }
    });
  });

  describe('contactSchema', () => {
    it('should validate correct contact data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Need help with the app',
        message: 'I am having trouble with the mood tracking feature.',
      };

      const result = contactSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject short subject', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Hi', // Too short
        message: 'I am having trouble with the mood tracking feature.',
      };

      const result = contactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject short message', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Need help',
        message: 'Help', // Too short
      };

      const result = contactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('onboardingSchema', () => {
    it('should validate correct onboarding data', () => {
      const validData = {
        goals: ['reduce_stress', 'improve_mood'],
        experience: 'beginner' as const,
        notifications: true,
        privacy: true,
      };

      const result = onboardingSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty goals', () => {
      const invalidData = {
        goals: [],
        experience: 'beginner' as const,
        notifications: true,
        privacy: true,
      };

      const result = onboardingSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject too many goals', () => {
      const invalidData = {
        goals: ['goal1', 'goal2', 'goal3', 'goal4', 'goal5', 'goal6'], // 6 goals
        experience: 'beginner' as const,
        notifications: true,
        privacy: true,
      };

      const result = onboardingSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid experience level', () => {
      const invalidData = {
        goals: ['reduce_stress'],
        experience: 'expert' as any, // Invalid value
        notifications: true,
        privacy: true,
      };

      const result = onboardingSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject privacy not accepted', () => {
      const invalidData = {
        goals: ['reduce_stress'],
        experience: 'beginner' as const,
        notifications: true,
        privacy: false,
      };

      const result = onboardingSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should default notifications to true', () => {
      const data = {
        goals: ['reduce_stress'],
        experience: 'beginner' as const,
        privacy: true,
      };

      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.notifications).toBe(true);
      }
    });
  });
});

describe('Validation Helper Functions', () => {
  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate correct passwords', () => {
      expect(validatePassword('password123')).toBe(true);
      expect(validatePassword('verylongpassword')).toBe(true);
    });

    it('should reject short passwords', () => {
      expect(validatePassword('12345')).toBe(false);
      expect(validatePassword('')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello world  ')).toBe('hello world');
    });

    it('should remove dangerous characters', () => {
      expect(sanitizeInput('hello<script>alert("xss")</script>world')).toBe('helloscriptalert("xss")/scriptworld');
    });

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput('   ')).toBe('');
    });
  });
});
