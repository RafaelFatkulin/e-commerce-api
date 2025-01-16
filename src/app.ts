import { configureOpenAPI } from '@lib/configure-open-api'
import { createApp } from '@lib/create-app'
import { auth } from '@modules/auth'
import { core } from '@modules/core'
import { user } from '@modules/user'

export const app = createApp()

const routes = [
  core,
  user,
  auth,
]

configureOpenAPI(app)

routes.forEach((route) => {
  app.route('/', route)
})
