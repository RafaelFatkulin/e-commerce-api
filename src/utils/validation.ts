import type { Context, Env, Input } from 'hono'
import type { ZodError } from 'zod'
import { createErrorResponse } from './response'

export function validateJsonSchema(result: (
  | {
    success: true
    data: any
  }
  | {
    success: false
    error: ZodError
    data: any
  }
  ) & {
    target: 'json'
  }, c: Context<Env, string, Input>) {
  if (!result.success) {
    return c.json(createErrorResponse({ errors: result.error.format() }), 400)
  }
}
