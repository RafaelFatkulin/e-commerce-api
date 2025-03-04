import type { z } from '@hono/zod-openapi'
import type { categoriesFilterSchema, categoryCreateSchema, categoryMinimalSchema, categorySchema, categoryUpdateSchema } from './category.schema'

export type Category = z.infer<typeof categorySchema>
export type CreateCategory = z.infer<typeof categoryCreateSchema>
export type UpdateCategory = z.infer<typeof categoryUpdateSchema>
export type CategoriesFilter = z.infer<typeof categoriesFilterSchema>
export type CategoryMinimal = z.infer<typeof categoryMinimalSchema>