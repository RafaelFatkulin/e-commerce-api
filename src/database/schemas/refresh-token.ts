 import { boolean, integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

export const refreshToken = pgTable('refresh_tokens', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  token: varchar('token', { length: 255 }).notNull(),
  issuedAt: timestamp('issued_at').defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
  revoked: boolean('revoked').default(false),
  userId: integer('user_id'),
})
