import { table } from '@database/schemas'
import { mediaStatus, mediaType } from '@database/schemas/media'
import { z } from '@hono/zod-openapi'
import { enumField, stringField } from '@utils/zod'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'

export const mediaSelectSchema = createSelectSchema(table.media).openapi('Media schema')
export const mediaCreateSchema = createInsertSchema(table.media, {
  type: enumField(mediaType.enumValues).openapi({ examples: mediaType.enumValues }),
  path: stringField(20, 255),
  alt: stringField(4, 255).optional(),
  order: z.number().min(1, 'Минимальное значение поля - 1').nullable().optional(),
  status: enumField(mediaStatus.enumValues).openapi({ examples: mediaStatus.enumValues }),
}).openapi('Media create schema')
export const mediaUpdateSchema = createUpdateSchema(table.media).openapi('Media update schema')
export const mediaSourceSchema = z.enum(['brand', 'product', 'category'])
export const mediaTypeSchema = createSelectSchema(mediaType)
export const mediaStatusSchema = createSelectSchema(mediaStatus)
export const mediaOrderChangeSchema = z.array(
  z.object({
    id: z.number(),
    order: z.number(),
  }),
)
export const mediaChangeStatusSchema = z.object({
  status: mediaStatusSchema,
})
