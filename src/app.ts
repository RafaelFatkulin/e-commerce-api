import { configureOpenAPI } from '@lib/configure-open-api'
import { createApp } from '@lib/create-app'
import { core } from '@modules/core'
import { user } from '@modules/user'

export const app = createApp()

const routes = [
  core,
  user,
]

configureOpenAPI(app)

routes.forEach((route) => {
  app.route('/', route)
})
