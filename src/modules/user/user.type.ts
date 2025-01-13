import { z } from "zod";
import {
  userCreateSchema,
  userSelectSchema,
  userUpdateSchema,
} from "./user.schema";

export type CreateUser = z.infer<typeof userCreateSchema>;
export type UpdateUser = z.infer<typeof userUpdateSchema>;
export type User = z.infer<typeof userSelectSchema>;
