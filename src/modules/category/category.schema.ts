import { table } from '@database/schemas'
import { z } from '@hono/zod-openapi'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'

export const categorySelectSchema = createSelectSchema(table.categories).openapi('Category schema')
export const categorySchema = categorySelectSchema.extend({
  categories: z.array(categorySelectSchema).optional(),
}).openapi('Category schema')
export const categoryCreateSchema = createInsertSchema(table.categories).openapi('Category create schema')
export const categoryUpdateSchema = createUpdateSchema(table.categories).openapi('Category update schema')

export const categoryTreeSchema = z.object({
  tree: z.ostring().transform((value) => {
    if (value === undefined)
      return undefined // Keep it optional
    if (value === 'true')
      return true
    if (value === 'false')
      return false
    throw new Error('Invalid boolean value') // For unexpected values
  }),
})
