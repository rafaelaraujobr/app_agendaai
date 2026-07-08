import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "Informe um e-mail válido." }).toLowerCase(),
  password: z
    .string({ error: "Informe sua senha." })
    .min(6, { error: "A senha deve ter pelo menos 6 caracteres." })
    .max(100, { error: "A senha deve ter no máximo 100 caracteres." }),
});

export const registerSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100).optional(),
  email: z.email().toLowerCase(),
  password: z.string().min(6).max(100),
});

export const forgotPasswordSchema = z.object({
  email: z.email().toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1).max(100),
  password: z.string().min(6).max(100),
});

export const loginWithGoogleSchema = z.object({
  googleId: z.string().min(1).max(100),
  email: z.email().toLowerCase(),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type LoginWithGoogleSchema = z.infer<typeof loginWithGoogleSchema>;
