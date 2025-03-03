import { jsonContent } from '@helpers/json-content'
import { jsonContentRequired } from '@helpers/json-content-required'
import { createRoute, z } from '@hono/zod-openapi'
import { errorResponseSchema, getSuccessResponseSchema } from '@utils/response'
import { HttpStatusCodes } from '@utils/status-codes'
import { IdParamsSchema } from '@utils/zod'
import { brandCreateSchema, brandMinimalSchema, brandSelectSchema, brandsFilterSchema, brandUpdateSchema } from './brand.schema'
import { authMiddleware } from '@modules/auth/auth.middleware'

const tags = ['Brands']

const paths = {
  root: '/brands',
  id: () => paths.root.concat('/{id}'),
  create: () => paths.root,
  update: () => paths.id().concat('/edit'),
  delete: () => paths.id().concat('/delete'),
  uploadMedia: () => paths.id().concat('/upload-media'),
  minimalList: () => paths.root.concat('/list')
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
  minimalList: createRoute({
    tags,
    path: paths.minimalList(),
    method: 'get',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        getSuccessResponseSchema(z.array(brandMinimalSchema)),
        'The list of minimal brands',
      ),
      [HttpStatusCodes.BAD_REQUEST]: jsonContent(
        errorResponseSchema,
        'Error when getting a list of minimal brands',
      ),
    }
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
    middleware: [(c, next) => authMiddleware(c, next, ['admin'])] as const,
    security: [{
      Bearer: [],
    }],
    request: {
      body: {
        content: {
          'multipart/form-data': {
            schema: z.object({
              title: z.string().min(1, 'Title is required'),
              description: z.string().optional(),
              files: z.array(z.instanceof(File)).optional(),
            }),
          },
        },
      },
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
  uploadMedia: createRoute({
    tags,
    path: paths.uploadMedia(),
    method: 'post',
    middleware: [(c, next) => authMiddleware(c, next, ['admin'])] as const,
    security: [{
      Bearer: [],
    }],
    request: {
      params: IdParamsSchema,
      body: {
        content: {
          'multipart/form-data': {
            schema: z.object({
              files: z.array(z.instanceof(File)).optional(),
            }),
          },
        },
      },
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(
        getSuccessResponseSchema(),
        'Brand files successfully uploaded',
      ),
      [HttpStatusCodes.BAD_REQUEST]: jsonContent(
        errorResponseSchema,
        'Error when uploading files for brand',
      ),
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
        errorResponseSchema,
        'Error when uploading files for brand',
      ),
    },
  }),
  update: createRoute({
    tags,
    path: paths.update(),
    method: 'patch',
    middleware: [(c, next) => authMiddleware(c, next, ['admin'])] as const,
    security: [{
      Bearer: [],
    }],
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
    middleware: [(c, next) => authMiddleware(c, next, ['admin'])] as const,
    security: [{
      Bearer: [],
    }],
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
export type MinimalListRoute = typeof routes.minimalList
export type GetRoute = typeof routes.get
export type CreateRoute = typeof routes.create
export type UpdateRoute = typeof routes.update
export type DeleteRoute = typeof routes.delete
export type UploadMediaRoute = typeof routes.uploadMedia
