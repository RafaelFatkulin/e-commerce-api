import { jsonContent } from '@helpers/json-content'
import { jsonContentRequired } from '@helpers/json-content-required'
import { createRoute, z } from '@hono/zod-openapi'
import { userSelectSchema, userUpdateSchema } from '@modules/user/user.schema'
import { errorResponseSchema, getSuccessResponseSchema } from '@utils/response'
import { HttpStatusCodes } from '@utils/status-codes'
import { authMiddleware } from './auth.middleware'
import { refreshSchema, signinSchema, signoutSchema, signupSchema } from './auth.schema'

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
      'Signup successfull',
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorResponseSchema,
      'Signup error',
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
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getSuccessResponseSchema(
        z.object({
          accessToken: z.string(),
          refreshToken: z.string(),
          expiresAt: z.date(),
        }),
      ),
      'Signin successfull',
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorResponseSchema,
      'Signin error',
    ),
  },
})

const signout = createRoute({
  tags,
  path: '/signout',
  method: 'post',
  request: {
    body: jsonContentRequired(signoutSchema, 'Signout data'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getSuccessResponseSchema(),
      'Signout successfull',
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorResponseSchema,
      'Signout error',
    ),
  },
})

const refresh = createRoute({
  tags,
  path: '/refresh',
  method: 'post',
  request: {
    body: jsonContentRequired(refreshSchema, 'Refresh token data'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getSuccessResponseSchema(),
      'Refreshing roken successfull',
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorResponseSchema,
      'Retresh token error',
    ),
  },
})

const profile = createRoute({
  tags,
  path: '/profile',
  method: 'get',
  middleware: [authMiddleware] as const,
  security: [{
    Bearer: [],
  }],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getSuccessResponseSchema(userSelectSchema),
      'Profile info',
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorResponseSchema,
      'User not found',
    ),
  },
})

const updateProfile = createRoute({
  tags,
  path: '/update-profile',
  method: 'post',
  middleware: [authMiddleware] as const,
  security: [{
    Bearer: [],
  }],
  request: {
    body: jsonContentRequired(userUpdateSchema, 'Update profile data'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getSuccessResponseSchema(),
      'Profile updated',
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorResponseSchema,
      'User not found',
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorResponseSchema,
      'Profile update error',
    ),
  },
})

export const routes = {
  signup,
  signin,
  signout,
  refresh,
  profile,
  updateProfile,
}

export type SignupRoute = typeof signup
export type SigninRoute = typeof signin
export type SignoutRoute = typeof signout
export type RefreshTokenRoute = typeof refresh
export type ProfileRoute = typeof profile
export type UpdateProfileRoute = typeof updateProfile
