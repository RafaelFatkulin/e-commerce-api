import { configureOpenAPI } from '@lib/configure-open-api'
import { createApp } from '@lib/create-app'
import { auth } from '@modules/auth'
import { brand } from '@modules/brand'
import { category } from '@modules/category'
import { core } from '@modules/core'
import { user } from '@modules/user'
import { serveStatic } from 'hono/bun'
import { cors } from 'hono/cors'

export const app = createApp()

app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    allowMethods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
)

const routes = [
  core,
  user,
  auth,
  category,
  brand,
]

configureOpenAPI(app)

routes.forEach((route) => {
  app.route('/', route)
})

app.use('/static/*', serveStatic({ root: './' }))

app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
})
