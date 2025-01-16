import { refreshToken } from './refresh-token'
import { refreshTokenRelations } from './refresh-token-relations'
import { user } from './user'
import { userRelations } from './user-relations'

export {
  refreshToken,
  refreshTokenRelations,
  user,
  userRelations,
}

export const table = {
  user,
  userRelations,
  refreshToken,
  refreshTokenRelations,
} as const

export type Table = typeof table
