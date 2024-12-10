import { db } from "@/db";
import { takeUniqueOrThrow } from "@/utils/drizzle";
import { InsertColor, SelectColor, UpdateColor } from "./colors.type";
import { table } from "@db/schema";
import { eq } from "drizzle-orm";

const colorSelect = {
  id: table.color.id,
  title: table.color.title,
  value: table.color.value,
};

export const getColors = async (): Promise<SelectColor[]> => {
  return db.select(colorSelect).from(table.color);
};

export const getColorById = async (id: number): Promise<SelectColor> => {
  return db
    .select(colorSelect)
    .from(table.color)
    .where(eq(table.color.id, id))
    .then(takeUniqueOrThrow);
};

export const createColor = async (data: InsertColor): Promise<SelectColor> => {
  return db
    .insert(table.color)
    .values(data)
    .returning(colorSelect)
    .then(takeUniqueOrThrow);
};

export const updateColor = async (
  id: number,
  data: UpdateColor
): Promise<SelectColor> => {
  return db
    .update(table.color)
    .set({ ...data })
    .where(eq(table.color.id, id))
    .returning(colorSelect)
    .then(takeUniqueOrThrow);
};

export const deleteColor = async (id: number): Promise<SelectColor> => {
  return db
    .delete(table.color)
    .where(eq(table.color.id, id))
    .returning(colorSelect)
    .then(takeUniqueOrThrow);
};
