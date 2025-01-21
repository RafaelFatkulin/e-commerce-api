import { createRouter } from '@lib/create-app'
import { handlers } from './category.handlers'
import { routes } from './category.routes'

export const category = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.get, handlers.get)
