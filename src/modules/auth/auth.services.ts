import type { CreateRefreshToken } from './auth.type'
import { db } from '@database'
import { table } from '@database/schemas'
import { eq } from 'drizzle-orm'

export async function createRefreshToken(data: CreateRefreshToken) {
  return db
    .insert(table.refreshToken)
    .values(data)
    .returning()
}

export async function getRefreshToken(token: string, revoked?: boolean) {
  return db.query.refreshToken.findFirst({
    where(fields, { eq, and }) {
      const conditions = []
      conditions.push(eq(fields.token, token))

      if (revoked) {
        conditions.push(eq(fields.revoked, revoked))
      }

      return conditions.length > 0 ? and(...conditions) : undefined
    },
  })
}

export function revokeRefreshToken(id: number) {
  return db
    .update(table.refreshToken)
    .set({ revoked: true })
    .where(eq(table.refreshToken.id, id))
    .returning()
}
