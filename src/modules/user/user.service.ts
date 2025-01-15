import type { CreateUser, UpdateUser, UsersFilter } from './user.type'
import { db } from '@database'
import { table } from '@database/schemas'
import { asc, desc, eq, ilike, or } from 'drizzle-orm'

export async function getUsers(filter: UsersFilter) {
  const query = db.select().from(table.user)
  let { q, page, per_page = '10', sort_by, sort_order, role } = filter
  let totalUsers = 0
  let totalPages = 0

  if (q) {
    const searchQuery = `%${q.toLowerCase()}%`
    query.where(
      or(
        ilike(table.user.email, searchQuery),
        ilike(table.user.fullName, searchQuery),
      ),
    )
  }

  if (role) {
    query.where(eq(table.user.role, role))
  }

  if (page && per_page) {
    totalUsers = await db.$count(table.user)
    totalPages = Math.ceil(totalUsers / Number.parseInt(per_page))

    if (Number.parseInt(page) > totalPages) {
      page = totalPages.toString()
    }

    query
      .limit(Number.parseInt(per_page))
      .offset((Number.parseInt(page) - 1) * Number.parseInt(per_page))
  }

  if (sort_by && sort_order) {
    query.orderBy(
      sort_order === 'asc'
        ? asc(table.user[sort_by])
        : desc(table.user[sort_by]),
    )
  }

  return {
    data: await query,
    meta: page
      ? {
          total: totalUsers,
          totalPages,
          limit: Number.parseInt(per_page),
          page: Number.parseInt(page),
        }
      : undefined,
  }
}

export async function getUser(id: number) {
  return (await db.select().from(table.user).where(eq(table.user.id, id)))[0]
}

export async function getUserByEmail(email: string) {
  return (
    await db.select().from(table.user).where(eq(table.user.email, email))
  )[0]
}

export async function createUser(userData: CreateUser) {
  return db
    .insert(table.user)
    .values({ ...userData, role: userData.role as 'admin' | 'user' })
    .returning()
}

export async function updateUser(userId: number, userData: UpdateUser) {
  return db
    .update(table.user)
    .set(userData)
    .where(eq(table.user.id, userId))
    .returning()
}

export async function deleteUser(userId: number) {
  return db.delete(table.user).where(eq(table.user.id, userId)).returning()
}
