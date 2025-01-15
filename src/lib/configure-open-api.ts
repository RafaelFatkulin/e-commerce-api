import type { AppOpenAPI } from './types'
import { apiReference } from '@scalar/hono-api-reference'

export function configureOpenAPI(app: AppOpenAPI) {
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'E-commerce API documentation',
    },
  })

  app.get('/swagger', apiReference({
    theme: 'elysiajs',
    spec: {
      url: '/doc',
    },
  }))
}
