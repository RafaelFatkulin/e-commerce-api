import type { AppRouteHandler } from 'types'
import type { SigninRoute, SignupRoute } from './auth.routes'
import { createUser, getUserByEmail } from '@modules/user/user.service'
import { createErrorResponse, createSuccessResponse } from '@utils/response'
import { HttpStatusCodes } from '@utils/status-codes'
import { createRefreshToken } from './auth.services'
import { generateTokens } from './auth.utils'

const signup: AppRouteHandler<SignupRoute> = async (c) => {
  const data = c.req.valid('json')

  const existingUser = await getUserByEmail(data.email)

  if (existingUser) {
    return c.json(
      createErrorResponse({ message: 'Пользователь с таким Email уже существует' }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }

  const [user] = await createUser({
    ...data,
    role: 'user',
  })

  if (!user) {
    return c.json(
      createErrorResponse({ message: 'Произошла ошибка при регистрации' }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }

  const { at, rt, rtExpiresAt } = await generateTokens(user.id, user.role)

  await createRefreshToken({
    token: rt,
    userId: user.id,
    expiresAt: rtExpiresAt,
  })

  return c.json(
    createSuccessResponse({
      message: 'Успешная регистрация',
      data: {
        accessToken: at,
        refreshToken: rt,
        expiresAt: rtExpiresAt,
      },
    }),
    201,
  )
}

const signin: AppRouteHandler<SigninRoute> = async (c) => {
  const data = c.req.valid('json')
}

export const handlers = {
  signup,
}
