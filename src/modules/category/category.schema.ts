import { table } from '@database/schemas'
import { categoryStatus } from '@database/schemas/category'
import { z } from '@hono/zod-openapi'
import { enumField, stringField } from '@utils/zod'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'

export const categorySelectSchema = createSelectSchema(table.categories).openapi('Category schema')
export const categorySchema = categorySelectSchema.extend({
  categories: z.array(categorySelectSchema).optional(),
}).openapi('Category schema')
export const categoryCreateSchema = createInsertSchema(table.categories, {
  shortTitle: stringField(4, 128).optional(),
  title: stringField(4, 128),
  slug: stringField().optional().nullable().optional(),
  description: stringField().nullable().optional(),
  parentId: z.number().nullable().optional(),
  order: z.number().min(1, 'Минимальное значение поля - 1').nullable().optional(),
  status: enumField(categoryStatus.enumValues).optional().openapi({ examples: categoryStatus.enumValues }),
}).openapi('Category create schema')
export const categoryUpdateSchema = createUpdateSchema(table.categories).openapi('Category update schema')

export const categoryTreeSchema = z.object({
  tree: z.ostring().transform((value) => {
    if (value === undefined)
      return undefined
    if (value === 'true')
      return true
    if (value === 'false')
      return false
    throw new Error('Invalid boolean value')
  }),
})

export const categoriesFilterSchema = z.object({
  q: z.string().optional().openapi('Search string'),
  parent_id: z.coerce.number().optional().openapi('Parent category id'),
  page: z.coerce.number().optional(),
  per_page: z.coerce.number().optional(),
  sort_by: categorySelectSchema.keyof().optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
})
