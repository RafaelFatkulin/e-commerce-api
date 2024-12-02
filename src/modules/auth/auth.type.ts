import { z } from "zod";
import { loginSchema, registerSchema } from "./auth.schema";

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>; 