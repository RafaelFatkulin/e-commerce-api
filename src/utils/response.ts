import type { ZodSchema } from 'zod'
import { z } from '@hono/zod-openapi'

export const successResponseSchema = z.object({
  message: z.string().optional().nullable(),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }).optional().nullable(),
  data: z.any(),
})

export function getSuccessResponseSchema(schema: ZodSchema, meta: boolean = false) {
  const result = successResponseSchema.extend({
    data: schema,
  })

  if (!meta) {
    return result.omit({
      meta: true,
    })
  }

  return result
}

export type SuccessResponse<D = any> = z.infer<typeof successResponseSchema> & {
  data: D
}

export function createSuccessResponse({
  message,
  data,
  meta,
}: SuccessResponse) {
  return {
    success: true,
    message: message ?? null,
    data,
    meta,
  }
}

export const errorResponseSchema = z.object({
  message: z.union([z.string(), z.record(z.string())]).optional(),
  errors: z.union([z.string(), z.record(z.any())]).optional(),
})

export type ErrorResponse = z.infer<typeof errorResponseSchema>

export function createErrorResponse({
  message,
  errors,
}: ErrorResponse) {
  return {
    success: false,
    message,
    errors,
    data: null,
  }
}
