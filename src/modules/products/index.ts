import { createRouter } from '@lib/create-app'
import { routes } from './products.router'
import { handlers } from './products.handlers'

export * from './products.schema'
export * from './products.type'
export * from './products.service'
export * from './products.router'
export * from './products.handlers'

export const products = createRouter()
    .openapi(routes.list, handlers.list)
    .openapi(routes.get, handlers.get)
    .openapi(routes.getBySlug, handlers.getBySlug)
    .openapi(routes.create, handlers.create)
    .openapi(routes.edit, handlers.edit)
    .openapi(routes.delete, handlers.delete)