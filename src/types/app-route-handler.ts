import type { RouteConfig, RouteHandler } from '@hono/zod-openapi'
import type { AppBindings } from '@lib/types'

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>
