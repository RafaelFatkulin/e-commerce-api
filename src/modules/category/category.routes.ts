import { jsonContent } from '@helpers/json-content'
import { jsonContentRequired } from '@helpers/json-content-required'
import { createRoute, z } from '@hono/zod-openapi'
import { authMiddleware } from '@modules/auth/auth.middleware'
import { errorResponseSchema, getSuccessResponseSchema } from '@utils/response'
import { HttpStatusCodes } from '@utils/status-codes'
import { IdParamsSchema } from '@utils/zod'
import { categoriesFilterSchema, categoryCreateSchema, categorySchema, categorySelectSchema, categoryTreeSchema, categoryUpdateSchema } from './category.schema'

const basePath = '/categories'
const tags = ['Categories']

const list = createRoute({
  tags,
  path: basePath,
  method: 'get',
  request: {
    query: categoriesFilterSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getSuccessResponseSchema(z.array(categorySchema)),
      'The list of categories',
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorResponseSchema,
      'Error when getting a categories',
    ),
  },
})

const tree = createRoute({
  tags,
  path: basePath.concat('/tree'),
  method: 'get',
  request: {
    query: z.object({
      category_id: z.coerce.number().optional().openapi('Category Id'),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getSuccessResponseSchema(z.array(categorySchema)),
      'The tree of categories',
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorResponseSchema,
      'Error when getting a categories tree',
    ),
  },
})

const get = createRoute({
  tags,
  path: basePath.concat('/{id}'),
  method: 'get',
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getSuccessResponseSchema(categorySchema),
      'Category successfully found',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      'Category not found',
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorResponseSchema,
      'Error when getting a category',
    ),
  },
})

const create = createRoute({
  tags,
  path: basePath,
  method: 'post',
  middleware: [(c, next) => authMiddleware(c, next, ['admin'])] as const,
  security: [{
    Bearer: [],
  }],
  request: {
    body: jsonContentRequired(categoryCreateSchema, 'Category to create'),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      getSuccessResponseSchema(categoryCreateSchema),
      'Category successfully created',
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorResponseSchema,
      'Error when creating a Category',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorResponseSchema,
      'Error when creating a Category',
    ),
  },
})

const update = createRoute({
  tags,
  path: basePath.concat('/{id}'),
  method: 'patch',
  middleware: [(c, next) => authMiddleware(c, next, ['admin'])] as const,
  security: [{
    Bearer: [],
  }],
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(categoryUpdateSchema, 'Category\'s data to update'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getSuccessResponseSchema(categoryUpdateSchema),
      'Category successfully updated',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      'Category not found',
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorResponseSchema,
      'Error when updating a category',
    ),
  },
})

const deleteCategory = createRoute({
  tags,
  path: basePath.concat('/{id}'),
  method: 'delete',
  middleware: [(c, next) => authMiddleware(c, next, ['admin'])] as const,
  security: [{
    Bearer: [],
  }],
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getSuccessResponseSchema(categorySelectSchema),
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
  tree,
  get,
  create,
  update,
  delete: deleteCategory,
}

export type ListRoute = typeof list
export type TreeRoute = typeof tree
export type GetRoute = typeof get
export type CreateRoute = typeof create
export type UpdateRoute = typeof update
export type DeleteRoute = typeof deleteCategory
