import type { z } from '@hono/zod-openapi'
import type {
  mediaCreateSchema,
  mediaOrderChangeSchema,
  mediaSelectSchema,
  mediaSourceSchema,
  mediaStatusSchema,
  mediaTypeSchema,
  mediaUpdateSchema,
} from './media.schema'

export type Media = z.output<typeof mediaSelectSchema>
export type CreateMedia = z.output<typeof mediaCreateSchema>
export type UpdateMedia = z.output<typeof mediaUpdateSchema>
export type MediaSource = z.output<typeof mediaSourceSchema>
export type MediaType = z.output<typeof mediaTypeSchema>
export type MediaStatus = z.output<typeof mediaStatusSchema>
export type MediaOrderChange = z.output<typeof mediaOrderChangeSchema>
