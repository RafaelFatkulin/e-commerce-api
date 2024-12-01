import {createInsertSchema, createSelectSchema} from "drizzle-zod";
import {table} from "@db/schema";

export const insertUserSchema = createInsertSchema(table.user)
export const selectUserSchema = createSelectSchema(table.user)

export const updateUserSchema = insertUserSchema.pick({
    name: true,
    surname: true,
    patronymic: true,
    email: true,
})