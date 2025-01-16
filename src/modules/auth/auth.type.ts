import type { z } from '@hono/zod-openapi'
import type { refreshTokenCreateSchema, refreshTokenSelectSchema, refreshTokenUpdateSchema } from './auth.schema'

export type RefreshToken = z.infer<typeof refreshTokenSelectSchema>
export type CreateRefreshToken = z.infer<typeof refreshTokenCreateSchema>
export type UpdateRefreshToken = z.infer<typeof refreshTokenUpdateSchema>
