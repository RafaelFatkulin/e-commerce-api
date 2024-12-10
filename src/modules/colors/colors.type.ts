import { z } from "zod";
import {
  insertColorSchema,
  selectColorSchema,
  updateColorSchema,
} from "./colors.schema";

export type InsertColor = z.infer<typeof insertColorSchema>;
export type SelectColor = z.infer<typeof selectColorSchema>;
export type UpdateColor = z.infer<typeof updateColorSchema>;
