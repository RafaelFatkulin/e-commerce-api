import { createRouter } from '@lib/create-app'
import { handlers } from './auth.handlers'
import { routes } from './auth.routes'

export const auth = createRouter()
  .openapi(routes.signup, handlers.signup)
  .openapi(routes.signin, handlers.signin)
  .openapi(routes.signout, handlers.signout)
  .openapi(routes.refresh, handlers.refresh)
  .openapi(routes.profile, handlers.profile)
  .openapi(routes.updateProfile, handlers.updateProfile)
