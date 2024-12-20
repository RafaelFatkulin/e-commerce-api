import { z } from "zod";
import {
  insertCategorySchema,
  returnCategorySchema,
  selectCategorySchema,
  updateCategorySchema,
} from "./categories.schema";

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type SelectCategory = z.infer<typeof selectCategorySchema>;
export type ReturnCategory = z.infer<typeof returnCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;
