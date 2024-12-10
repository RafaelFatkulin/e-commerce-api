import { table } from "@db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const insertColorSchema = createInsertSchema(table.color, {
  title: z.string().min(4, "Минимальная длина названия - 4 символа"),
  value: z.string().min(3, "Некорректный формат цвета"),
});

export const selectColorSchema = createSelectSchema(table.color);

export const updateColorSchema = insertColorSchema
  .pick({
    title: true,
    value: true,
  })
  .partial();
