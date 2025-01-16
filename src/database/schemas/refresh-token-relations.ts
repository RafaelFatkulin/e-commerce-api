import { relations } from 'drizzle-orm'
import { refreshToken } from './refresh-token'
import { user } from './user'

export const refreshTokenRelations = relations(refreshToken, ({ one }) => ({
  user: one(user, {
    fields: [refreshToken.userId],
    references: [user.id],
  }),
}))
