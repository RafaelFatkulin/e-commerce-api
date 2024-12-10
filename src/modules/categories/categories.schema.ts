import { table } from "@db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const insertCategorySchema = createInsertSchema(table.category, {
  title: z.string().min(4, "Минимальная длина названия - 4 символа"),
  slug: z.string().optional(),
});

export const selectCategorySchema = createSelectSchema(table.category);

export const returnCategorySchema = selectCategorySchema.omit({
  created_at: true,
  updated_at: true,
});

export const updateCategorySchema = insertCategorySchema
  .pick({
    title: true,
    slug: true,
  })
  .partial();
