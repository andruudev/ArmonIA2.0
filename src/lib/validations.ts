import { z } from 'zod';

// Auth validation schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido')
    .max(255, 'El email es demasiado largo'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña es demasiado larga'),
});

export const signupSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre es demasiado largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido')
    .max(255, 'El email es demasiado largo'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña es demasiado larga')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// Profile validation schema
export const profileSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre es demasiado largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido')
    .max(255, 'El email es demasiado largo'),
});

// Mood entry validation schema
export const moodEntrySchema = z.object({
  mood: z
    .string()
    .min(1, 'Debes seleccionar un estado de ánimo'),
  journal: z
    .string()
    .max(1000, 'El diario no puede exceder 1000 caracteres')
    .optional(),
  date: z
    .string()
    .min(1, 'La fecha es requerida')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido'),
});

// Chat message validation schema
export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'El mensaje no puede estar vacío')
    .max(1000, 'El mensaje no puede exceder 1000 caracteres')
    .trim(),
});

// Contact form validation schema
export const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre es demasiado largo'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido')
    .max(255, 'El email es demasiado largo'),
  subject: z
    .string()
    .min(1, 'El asunto es requerido')
    .min(5, 'El asunto debe tener al menos 5 caracteres')
    .max(100, 'El asunto es demasiado largo'),
  message: z
    .string()
    .min(1, 'El mensaje es requerido')
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(1000, 'El mensaje no puede exceder 1000 caracteres'),
});

// Onboarding validation schema
export const onboardingSchema = z.object({
  goals: z
    .array(z.string())
    .min(1, 'Debes seleccionar al menos un objetivo')
    .max(5, 'No puedes seleccionar más de 5 objetivos'),
  experience: z
    .enum(['beginner', 'intermediate', 'advanced'], {
      errorMap: () => ({ message: 'Debes seleccionar tu nivel de experiencia' }),
    }),
  notifications: z.boolean().default(true),
  privacy: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos de privacidad',
  }),
});

// Type exports for better TypeScript integration
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type MoodEntryFormData = z.infer<typeof moodEntrySchema>;
export type ChatMessageFormData = z.infer<typeof chatMessageSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;

// Validation helper functions
export const validateEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};

export const validatePassword = (password: string): boolean => {
  return z.string().min(6).safeParse(password).success;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Custom validation messages in Spanish
export const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.expected === 'string') {
        return { message: 'Este campo debe ser texto' };
      }
      if (issue.expected === 'number') {
        return { message: 'Este campo debe ser un número' };
      }
      break;
    case z.ZodIssueCode.too_small:
      if (issue.type === 'string') {
        return { message: `Mínimo ${issue.minimum} caracteres` };
      }
      if (issue.type === 'array') {
        return { message: `Debes seleccionar al menos ${issue.minimum} elemento(s)` };
      }
      break;
    case z.ZodIssueCode.too_big:
      if (issue.type === 'string') {
        return { message: `Máximo ${issue.maximum} caracteres` };
      }
      if (issue.type === 'array') {
        return { message: `No puedes seleccionar más de ${issue.maximum} elemento(s)` };
      }
      break;
    case z.ZodIssueCode.invalid_string:
      if (issue.validation === 'email') {
        return { message: 'Formato de email inválido' };
      }
      if (issue.validation === 'regex') {
        return { message: 'Formato inválido' };
      }
      break;
  }
  return { message: ctx.defaultError };
};

// Set custom error map globally
z.setErrorMap(customErrorMap);
