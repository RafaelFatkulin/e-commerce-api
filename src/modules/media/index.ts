import { createRouter } from '@lib/create-app'
import { handlers } from './media.handlers'
import { routes } from './media.router'

export * from './media.handlers'
export * from './media.router'
export * from './media.schema'
export * from './media.service'
export * from './media.type'

export const media = createRouter()
  .openapi(routes.changeOrder, handlers.changeOrder)
  .openapi(routes.changeStatus, handlers.changeStatus)
  .openapi(routes.deleteMedia, handlers.deleteMedia)
