import { createRouter } from '@lib/create-app'
import { handlers } from './brand.handlers'
import { routes } from './brand.router'

export const brand = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.minimalList, handlers.minimalList)
  .openapi(routes.get, handlers.get)
  .openapi(routes.create, handlers.create)
  .openapi(routes.update, handlers.update)
  .openapi(routes.delete, handlers.delete)
  .openapi(routes.uploadMedia, handlers.uploadMedia)
