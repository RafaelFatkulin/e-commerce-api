import { jsonContent } from '@helpers/json-content'
import { jsonContentRequired } from '@helpers/json-content-required'
import { createRoute, z } from '@hono/zod-openapi'
import { errorResponseSchema, getSuccessResponseSchema } from '@utils/response'
import { HttpStatusCodes } from '@utils/status-codes'
import { IdParamsSchema } from '@utils/zod'
import { brandCreateSchema, brandSelectSchema, brandsFilterSchema, brandUpdateSchema } from './brand.schema'

const tags = ['Brands']

const paths = {
  root: '/brands',
  id: () => paths.root.concat('/{id}'),
  create: () => paths.root,
  update: () => paths.id().concat('/update'),
  delete: () => paths.id().concat('/delete'),
}

export const routes = {
  list: createRoute({
    tags,
    path: paths.root,
    method: 'get',
    request: { query: brandsFilterSchema },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        getSuccessResponseSchema(z.array(brandSelectSchema)),
        'The list of brands',
      ),
      [HttpStatusCodes.BAD_REQUEST]: jsonContent(
        errorResponseSchema,
        'Error when getting a brands',
      ),
    },
  }),
  get: createRoute({
    tags,
    path: paths.id(),
    method: 'get',
    request: {
      params: IdParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        getSuccessResponseSchema(brandSelectSchema),
        'Brand successfully found',
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(
        errorResponseSchema,
        'Brand not found',
      ),
      [HttpStatusCodes.BAD_REQUEST]: jsonContent(
        errorResponseSchema,
        'Error when getting a brand',
      ),
    },
  }),
  create: createRoute({
    tags,
    path: paths.create(),
    method: 'post',
    request: {
      body: jsonContentRequired(brandCreateSchema, 'Brand to create'),
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(
        getSuccessResponseSchema(brandCreateSchema),
        'Brand successfully created',
      ),
      [HttpStatusCodes.BAD_REQUEST]: jsonContent(
        errorResponseSchema,
        'Error when creating a brand',
      ),
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
        errorResponseSchema,
        'Error when creating a brand',
      ),
    },
  }),
  update: createRoute({
    tags,
    path: paths.update(),
    method: 'patch',
    request: {
      params: IdParamsSchema,
      body: jsonContentRequired(brandUpdateSchema, 'Brand\'s data to update'),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        getSuccessResponseSchema(brandSelectSchema),
        'Brand successfully updated',
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(
        errorResponseSchema,
        'Brand not found',
      ),
      [HttpStatusCodes.BAD_REQUEST]: jsonContent(
        errorResponseSchema,
        'Error when updating a brand',
      ),
    },
  }),
  delete: createRoute({
    tags,
    path: paths.delete(),
    method: 'delete',
    request: {
      params: IdParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        getSuccessResponseSchema(brandSelectSchema),
        'Brand successfully deleted',
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(
        errorResponseSchema,
        'Brand not found',
      ),
      [HttpStatusCodes.BAD_REQUEST]: jsonContent(
        errorResponseSchema,
        'Error when deleting a brand',
      ),
    },
  }),
}

export type ListRoute = typeof routes.list
export type GetRoute = typeof routes.get
export type CreateRoute = typeof routes.create
export type UpdateRoute = typeof routes.update
export type DeleteRoute = typeof routes.delete
