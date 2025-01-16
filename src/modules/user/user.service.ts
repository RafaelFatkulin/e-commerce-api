import type { CreateUser, UpdateUser, User, UsersFilter } from './user.type'
import { db } from '@database'
import { table } from '@database/schemas'
import { eq } from 'drizzle-orm'

export function generatePassword(length: number = 12) {
  const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  const allChars = upperCaseChars + lowerCaseChars + numbers + specialChars
  const password = [
    upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)],
    lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    specialChars[Math.floor(Math.random() * specialChars.length)],
  ]

  for (let i = password.length; i < length; i++) {
    password.push(allChars[Math.floor(Math.random() * allChars.length)])
  }

  return password.sort(() => Math.random() - 0.5).join('')
}

export async function getUsers(filter: UsersFilter) {
  const { q, page = '1', per_page = '10', sort_by = 'id', sort_order = 'desc', role } = filter
  const totalUsers = await db.$count(table.user)
  const totalPages = Math.ceil(totalUsers / Number(per_page))

  const users = await db.query.user.findMany({
    where(fields, { or, ilike, eq }) {
      const conditions = []
      if (q) {
        const searchQuery = `%${q.toLowerCase()}%`
        conditions.push(
          or(
            ilike(fields.email, searchQuery),
            ilike(fields.fullName, searchQuery),
          ),
        )
      }
      if (role) {
        conditions.push(eq(fields.role, role))
      }
      return conditions.length > 0 ? or(...conditions) : undefined
    },
    orderBy(fields, operators) {
      return sort_order === 'asc'
        ? operators.asc(fields[sort_by])
        : operators.desc(fields[sort_by])
    },
    limit: Number(per_page),
    offset: (Number(page) - 1) * Number(per_page),
  })

  return {
    data: users,
    meta: page
      ? {
          total: totalUsers,
          totalPages,
          limit: Number(per_page),
          page: Number(page),
        }
      : undefined,
  }
}

export async function getUser(userId: number) {
  return await db.query.user.findFirst({
    where({ id }, { eq }) {
      return eq(id, userId)
    },
  })
}

export async function getUserByEmail(userEmail: string) {
  return await db.query.user.findFirst({
    where({ email }, { eq }) {
      return eq(email, userEmail)
    },
  })
}

export async function createUser(userData: CreateUser) {
  return db
    .insert(table.user)
    .values({
      ...userData,
      role: userData.role as User['role'],
      password: await Bun.password.hash(password'password', 'bcrypt'),
    })
    .returning()
}

export async function updateUser(userId: number, userData: UpdateUser) {
  return db
    .update(table.user)
    .set({
      ...userData,
      role: userData.role ? userData.role as 'admin' | 'user' : undefined,
    })
    .where(eq(table.user.id, userId))
    .returning()
}

export async function deleteUser(userId: number) {
  return db.delete(table.user).where(eq(table.user.id, userId)).returning()
}
