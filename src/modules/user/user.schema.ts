import { table } from "@database/schemas";
import { userRole } from "@database/schemas/user";
import {
  emailField,
  enumField,
  phoneField,
  stringField,
} from "@modules/core/helpers/zod";
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
  fullName: stringField(4, 128),
  email: emailField(),
  password: stringField(8, 64),
  phone: phoneField().optional(),
  role: enumField(userRole.enumValues),
}).omit({
  createdAt: true,
  updatedAt: true,
});

export const userUpdateSchema = createUpdateSchema(table.user, {
  email: emailField().optional(),
}).omit({
  createdAt: true,
  updatedAt: true,
});

export const usersFilterSchema = z.object({
  q: z.string().optional(),
  page: z.string().optional(),
  role: z.enum(userRole.enumValues).optional(),
  per_page: z.string().optional(),
  sort_by: userSelectSchema.keyof().optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
});
