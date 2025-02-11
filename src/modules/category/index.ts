import { createRouter } from '@lib/create-app'
import { handlers } from './category.handlers'
import { routes } from './category.routes'

export const category = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.tree, handlers.tree)
  .openapi(routes.get, handlers.get)
  .openapi(routes.getBySlug, handlers.getBySlug)
  .openapi(routes.create, handlers.create)
  .openapi(routes.update, handlers.update)
  .openapi(routes.delete, handlers.delete)
