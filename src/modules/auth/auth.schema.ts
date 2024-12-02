import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(8, "Минимальная длина пароля - 8 символов"),
});

export const registerSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(8, "Минимальная длина пароля - 8 символов"),
  name: z.string().min(2, "Минимальная длина имени - 2 символа"),
  surname: z.string().min(2, "Минимальная длина фамилии - 2 символа"),
  patronymic: z.string().optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});
