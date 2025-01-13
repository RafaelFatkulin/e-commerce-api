import { db } from "@database";
import { table } from "@database/schemas";
import { eq } from "drizzle-orm";
import { CreateUser, UpdateUser } from "./user.type";

export const getUsers = async () => {
  return db.select().from(table.user);
};

export const getUser = async (id: number) => {
  return (await db.select().from(table.user).where(eq(table.user.id, id)))[0];
};

export const getUserByEmail = async (email: string) => {
  return (
    await db.select().from(table.user).where(eq(table.user.email, email))
  )[0];
};

export const createUser = async (userData: CreateUser) => {
  return db.insert(table.user).values(userData).returning();
};

export const updateUser = async (userId: number, userData: UpdateUser) => {
  return db
    .update(table.user)
    .set(userData)
    .where(eq(table.user.id, userId))
    .returning();
};

export const deleteUser = async (userId: number) => {
  return db.delete(table.user).where(eq(table.user.id, userId)).returning();
};
