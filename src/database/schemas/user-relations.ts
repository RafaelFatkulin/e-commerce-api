import { relations } from 'drizzle-orm'
import { refreshToken } from './refresh-token'
import { user } from './user'

export const userRelations = relations(user, ({ many }) => ({
  refreshTokens: many(refreshToken),
}))
