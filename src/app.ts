import { configureOpenAPI } from '@lib/configure-open-api'
import { createApp } from '@lib/create-app'
import { auth } from '@modules/auth'
import { brand } from '@modules/brand'
import { category } from '@modules/category'
import { core } from '@modules/core'
import { media } from '@modules/media'
import { products } from '@modules/products'
import { user } from '@modules/user'
import { serveStatic } from 'hono/bun'

export const app = createApp()

const routes = [core, user, auth, category, brand, media, products]

configureOpenAPI(app)

routes.forEach((route) => {
  app.route('/', route)
})

app.use('/uploads/*', serveStatic({ root: './' }))

app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
})
