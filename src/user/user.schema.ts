import {
  createInsertSchema,
  createUpdateSchema,
  createSelectSchema,
} from "drizzle-typebox";
import { table } from "../database/schemas";
import { t } from "elysia";

export const createUserSchema = createInsertSchema(table.user, {
  email: t.String({ format: "email" }),
});

export const updateUserSchema = t.Omit(
  createUpdateSchema(table.user, {
    email: t.String({ format: "email" }),
  }),
  ["id"]
);

export const userSchema = createSelectSchema(table.user);
