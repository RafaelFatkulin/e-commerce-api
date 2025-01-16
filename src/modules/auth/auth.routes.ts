import { jsonContent } from '@helpers/json-content'
import { jsonContentRequired } from '@helpers/json-content-required'
import { createRoute, z } from '@hono/zod-openapi'
import { errorResponseSchema, getSuccessResponseSchema } from '@utils/response'
import { HttpStatusCodes } from '@utils/status-codes'
import { signinSchema, signupSchema } from './auth.schema'

const tags = ['Auth']

const signup = createRoute({
  tags,
  path: '/signup',
  method: 'post',
  request: {
    body: jsonContentRequired(signupSchema, 'Signup data'),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      getSuccessResponseSchema(
        z.object({
          accessToken: z.string(),
          refreshToken: z.string(),
          expiresAt: z.date(),
        }),
      ),
      'Registration successfull',
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorResponseSchema,
      'Registration error',
    ),
  },
})

const signin = createRoute({
  tags,
  path: '/signin',
  method: 'post',
  request: {
    body: jsonContentRequired(signinSchema, 'Signin data'),
  },
  responses: {},
})

export const routes = {
  signup,
  signin,
}

export type SignupRoute = typeof signup
export type SigninRoute = typeof signin
