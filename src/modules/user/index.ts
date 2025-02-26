import { createRouter } from '@lib/create-app'
import { handlers } from './user.handlers'
import { routes } from './user.routes'

export const user = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.getUser, handlers.get)
  .openapi(routes.createUser, handlers.create)
  .openapi(routes.updateUser, handlers.update)
  .openapi(routes.deleteUser, handlers.delete)
