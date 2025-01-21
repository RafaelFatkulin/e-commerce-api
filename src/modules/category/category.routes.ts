import { jsonContent } from '@helpers/json-content'
import { createRoute, z } from '@hono/zod-openapi'
import { errorResponseSchema, getSuccessResponseSchema } from '@utils/response'
import { HttpStatusCodes } from '@utils/status-codes'
import { IdParamsSchema } from '@utils/zod'
import { categorySchema, categoryTreeSchema } from './category.schema'

const basePath = '/categories'
const tags = ['Categories']

const list = createRoute({
  tags,
  path: basePath,
  method: 'get',
  request: {
    query: categoryTreeSchema,
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

export const routes = {
  list,
  get,
}

export type ListRoute = typeof list
export type GetRoute = typeof get
