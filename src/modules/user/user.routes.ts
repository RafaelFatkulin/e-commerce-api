import { jsonContent } from '@helpers/json-content'
import { jsonContentRequired } from '@helpers/json-content-required'
import { createRoute, z } from '@hono/zod-openapi'
import { errorResponseSchema, getSuccessResponseSchema, successResponseSchema } from '@utils/response'
import { HttpStatusCodes } from '@utils/status-codes'
import { IdParamsSchema } from '@utils/zod'
import { userCreateSchema, userSelectSchema, usersFilterSchema } from './user.schema'

const basePath = '/users'
const tags = ['Users']

const list = createRoute({
  tags,
  path: basePath,
  method: 'get',
  request: {
    query: usersFilterSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getSuccessResponseSchema(
        z.array(userSelectSchema),
        true,
      ),
      'The list of users',
    ),
  },
})

const getUser = createRoute({
  tags,
  path: basePath.concat('/{id}'),
  method: 'get',
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getSuccessResponseSchema(userSelectSchema),
      'User successfully found',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      'User not found',
    ),
  },
})

const createUser = createRoute({
  tags,
  path: basePath,
  method: 'post',
  request: {
    body: jsonContentRequired(userCreateSchema, 'User to create'),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      getSuccessResponseSchema(userSelectSchema),
      'User successfully created',
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorResponseSchema,
      'Error when creating a user',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorResponseSchema,
      'Error when creating a user',
    ),
  },
})

const deleteUser = createRoute({
  tags,
  path: basePath,
  method: 'delete',
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getSuccessResponseSchema(userSelectSchema),
      'User successfully deleted',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      'User not found',
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorResponseSchema,
      'Error when deleting a user',
    ),
  },
})

export const routes = {
  list,
  getUser,
  createUser,
  deleteUser,
}

export type ListRoute = typeof list
export type GetUserRoute = typeof getUser
export type CreateUserRoute = typeof createUser
export type DeleteUserRoute = typeof deleteUser
