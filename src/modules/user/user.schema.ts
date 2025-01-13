import { table } from "@database/schemas";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

export const userSelectSchema = createSelectSchema(table.user).omit({
  createdAt: true,
  updatedAt: true,
  password: true,
});

export const userCreateSchema = createInsertSchema(table.user, {
  email: z.string().email(),
}).omit({
  createdAt: true,
  updatedAt: true,
});

export const userUpdateSchema = createUpdateSchema(table.user, {
  email: z.string().email(),
}).omit({
  createdAt: true,
  updatedAt: true,
});
