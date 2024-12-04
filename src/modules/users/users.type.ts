import { z } from "zod";
import {
  insertUserSchema,
  selectUserSchema,
  updateUserSchema,
  returnUserSchema,
} from "./users.schema";

export type InsertUser = z.infer<typeof insertUserSchema>;
export type SelectUser = z.infer<typeof selectUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type ReturnUser = z.infer<typeof returnUserSchema>;
export type UserRole = "admin" | "user";
