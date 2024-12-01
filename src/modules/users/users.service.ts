import {db} from "@/db";
import {table} from "@db/schema";
import {InsertUser, UpdateUser} from "@modules/users/users.type";
import {eq} from "drizzle-orm";

export const getUsers = async () => {
    return db
        .select()
        .from(table.user);
}

export const getUserById = async (id: number) => {
    return db
        .select()
        .from(table.user)
        .where(eq(table.user.id, id));
}

export const getUserByEmail = async (email: string) => {
    return db
        .select()
        .from(table.user)
        .where(eq(table.user.email, email));
}

export const createUser = (data: InsertUser) => {
    return db
        .insert(table.user)
        .values(data)
        .returning()
}

export const updateUser = (id: number, data: UpdateUser) => {
    return db
        .update(table.user)
        .set(data)
        .where(eq(table.user.id, id))
        .returning()
}

export const deleteUser = async (id: number) => {
    return db
        .delete(table.user)
        .where(eq(table.user.id, id))
        .returning();
}