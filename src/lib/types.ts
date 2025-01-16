import type { OpenAPIHono } from '@hono/zod-openapi'
import type { PinoLogger } from 'hono-pino'

export interface AppBindings {
  Variables: {
    logger: PinoLogger
    user: unknown
  }
}

export type AppOpenAPI = OpenAPIHono<AppBindings>
