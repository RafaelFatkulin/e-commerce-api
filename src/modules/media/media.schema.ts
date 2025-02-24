import { table } from "@database/schemas";
import { mediaType, mediaStatus } from "@database/schemas/media";
import { enumField, stringField } from "@utils/zod";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "@hono/zod-openapi";

export const mediaSelectSchema = createSelectSchema(table.media).openapi('Media schema')
export const mediaCreateSchema = createInsertSchema(table.media, {
    type: enumField(mediaType.enumValues).openapi({ examples: mediaType.enumValues }),
    path: stringField(20, 255),
    alt: stringField(4, 255).optional(),
    order: z.number().min(1, 'Минимальное значение поля - 1').nullable().optional(),
    status: enumField(mediaStatus.enumValues).openapi({ examples: mediaStatus.enumValues })
}).openapi('Media create schema')
export const mediaUpdateSchema = createUpdateSchema(table.media).openapi('Media update schema')
export const mediaSourceSchema = z.enum(['brand', 'product', 'category'])
export const mediaTypeSchema = createSelectSchema(mediaType)
export const mediaStatusSchema = createSelectSchema(mediaStatus)