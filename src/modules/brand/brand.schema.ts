import { table } from '@database/schemas'
import { z } from '@hono/zod-openapi'
import { stringField } from '@utils/zod'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'

export const brandSelectSchema = createSelectSchema(table.brands)
  .openapi('Brand schema')

export const brandCreateSchema = createInsertSchema(table.brands, {
  title: stringField(3, 128),
  slug: stringField().optional().nullable(),
  description: stringField().nullable().optional(),
  order: z.number().min(1, 'Минимальное значение поля - 1').nullable().optional(),
  status: z.enum(['active', 'not-active']).nullable().optional(),
}).openapi('Brand create schema')

export const brandUpdateSchema = createUpdateSchema(table.brands, {
  title: stringField(3, 128).optional(),
  slug: stringField().optional(),
  description: stringField().optional(),
  order: z.number().min(1, 'Минимальное значение поля - 1').optional(),
  status: z.enum(['active', 'not-active']).optional(),
}).openapi('Brand update schema')

export const brandsFilterSchema = z.object({
  q: z.string().optional().openapi('Search string'),
  page: z.coerce.number().optional(),
  per_page: z.coerce.number().optional(),
  sort_by: brandSelectSchema.keyof().optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
})

export const brandsMediaSchema = createSelectSchema(table.brandsMedia)

export const brandMinimalSchema = brandSelectSchema.pick({
  id: true,
  title: true,
})