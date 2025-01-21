import { configureOpenAPI } from '@lib/configure-open-api'
import { createApp } from '@lib/create-app'
import { auth } from '@modules/auth'
import { category } from '@modules/category'
import { core } from '@modules/core'
import { user } from '@modules/user'

export const app = createApp()

const routes = [
  core,
  user,
  auth,
  category,
]

configureOpenAPI(app)

routes.forEach((route) => {
  app.route('/', route)
})

app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
})
