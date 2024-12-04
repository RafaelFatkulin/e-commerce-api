import { db } from "@/db";
import { takeUniqueOrThrow } from "@/utils/drizzle";
import { InsertCategory, ReturnCategory } from "./categories.type";
import { table } from "@/db/schema";
import { eq } from "drizzle-orm";

// Object with category selection fields, excluding sensitive data
const categorySelect = {
  id: table.category.id,
  title: table.category.title,
} as const;

/**
 * Get list of all categories
 */
export const getCategories = async (): Promise<ReturnCategory[]> => {
  return db.select(categorySelect).from(table.category);
};

/**
 * Get category by ID
 * @throws {Error} If category is not found
 */
export const getCategoryById = async (id: number): Promise<ReturnCategory> => {
  return db
    .select(categorySelect)
    .from(table.category)
    .where(eq(table.category.id, id))
    .then(takeUniqueOrThrow);
};

/**
 * Get category by title
 * @throws {Error} If category is not found
 */
export const getCategoryByTitle = async (
  title: string
): Promise<ReturnCategory> => {
  return db
    .select(categorySelect)
    .from(table.category)
    .where(eq(table.category.title, title))
    .then(takeUniqueOrThrow);
};

/**
 * Create new category
 * @throws {Error} If category creation fails
 */
export const createCategory = async (
  data: InsertCategory
): Promise<ReturnCategory> => {
  return db
    .insert(table.category)
    .values(data)
    .returning(categorySelect)
    .then(takeUniqueOrThrow);
};

/**
 * Update category data
 * @throws {Error} If category is not found or update fails
 */
export const updateCategory = async (
  id: number,
  data: InsertCategory
): Promise<ReturnCategory> => {
  return db
    .update(table.category)
    .set({ ...data, updated_at: new Date() })
    .where(eq(table.category.id, id))
    .returning(categorySelect)
    .then(takeUniqueOrThrow);
};

/**
 * Delete category
 * @throws {Error} If category is not found
 */
export const deleteCategory = async (id: number): Promise<ReturnCategory> => {
  return db
    .delete(table.category)
    .where(eq(table.category.id, id))
    .returning(categorySelect)
    .then(takeUniqueOrThrow);
};


