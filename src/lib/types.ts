import type { OpenAPIHono } from '@hono/zod-openapi'
import type { User } from '@modules/user/user.type'
import type { PinoLogger } from 'hono-pino'

export interface AppBindings {
  Variables: {
    logger: PinoLogger
    user: User
  }
}

export type AppOpenAPI = OpenAPIHono<AppBindings>
