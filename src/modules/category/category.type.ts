import type { z } from '@hono/zod-openapi'
import type { categoryCreateSchema, categorySchema, categoryUpdateSchema } from './category.schema'

export type Category= z.infer<typeof categorySchema>
export type CreateCategory = z.infer<typeof categoryCreateSchema>
export type UpdateCategory = z.infer<typeof categoryUpdateSchema>
