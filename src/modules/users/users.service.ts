import { db } from "@/db";
import { takeUniqueOrThrow } from "@/utils/drizzle";
import { table } from "@db/schema";
import {
  InsertUser,
  ReturnUser,
  SelectUser,
  UpdateUser,
} from "@modules/users/users.type";
import { eq } from "drizzle-orm";

// Object with user selection fields, excluding sensitive data
const userSelect = {
  id: table.user.id,
  email: table.user.email,
  name: table.user.name,
  surname: table.user.surname,
  patronymic: table.user.patronymic,
  role: table.user.role,
} as const;

/**
 * Get list of all users
 */
export const getUsers = async (): Promise<ReturnUser[]> => {
  return db.select(userSelect).from(table.user);
};

/**
 * Get user by ID
 * @throws {Error} If user is not found
 */
export const getUserById = async (id: number): Promise<ReturnUser> => {
  return db
    .select(userSelect)
    .from(table.user)
    .where(eq(table.user.id, id))
    .then(takeUniqueOrThrow);
};

/**
 * Get user by email
 * @throws {Error} If user is not found
 */
export const getUserByEmail = async (email: string): Promise<SelectUser> => {
  return db
    .select()
    .from(table.user)
    .where(eq(table.user.email, email))
    .then(takeUniqueOrThrow);
};

/**
 * Create new user
 * @throws {Error} If user creation fails
 */
export const createUser = async (data: InsertUser): Promise<ReturnUser> => {
  return db
    .insert(table.user)
    .values(data)
    .returning(userSelect)
    .then(takeUniqueOrThrow);
};

/**
 * Update user data
 * @throws {Error} If user is not found or update fails
 */
export const updateUser = async (
  id: number,
  data: UpdateUser
): Promise<ReturnUser> => {
  return db
    .update(table.user)
    .set({ ...data, updated_at: new Date() })
    .where(eq(table.user.id, id))
    .returning(userSelect)
    .then(takeUniqueOrThrow);
};

/**
 * Delete user
 * @throws {Error} If user is not found
 */
export const deleteUser = async (id: number): Promise<ReturnUser> => {
  return db
    .delete(table.user)
    .where(eq(table.user.id, id))
    .returning(userSelect)
    .then(takeUniqueOrThrow);
};
