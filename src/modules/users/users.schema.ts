import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { table } from "@db/schema";
import { z } from "zod";

export const insertUserSchema = createInsertSchema(table.user, {
  email: z.string().email("Некорректный email"),
  password: z.string().min(6, "Минимальная длина пароля - 8 символов"),
  name: z.string().min(2, "Минимальная длина имени - 2 символа"),
  surname: z.string().min(2, "Минимальная длина фамилии - 2 символа"),
  patronymic: z.string().optional(),
});

export const selectUserSchema = createSelectSchema(table.user);

export const returnUserSchema = selectUserSchema.omit({
  password: true,
  created_at: true,
  updated_at: true,
});

export const updateUserSchema = insertUserSchema
  .pick({
    name: true,
    surname: true,
    patronymic: true,
    email: true,
  })
  .partial();
