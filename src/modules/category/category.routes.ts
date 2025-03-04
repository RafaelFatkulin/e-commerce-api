import { jsonContent } from '@helpers/json-content'
import { jsonContentRequired } from '@helpers/json-content-required'
import { createRoute, z } from '@hono/zod-openapi'
import { authMiddleware } from '@modules/auth/auth.middleware'
import { errorResponseSchema, getSuccessResponseSchema } from '@utils/response'
import { HttpStatusCodes } from '@utils/status-codes'
import { IdParamsSchema, SlugParamsSchema } from '@utils/zod'
import { categoriesFilterSchema, categoryCreateSchema, categoryMinimalSchema, categorySchema, categorySelectSchema, categoryUpdateSchema } from './category.schema'

const tags = ['Categories']

const paths = {
  root: '/categories',
  id: () => paths.root.concat('/{id}'),
  create: () => paths.root,
  update: () => paths.id().concat('/edit'),
  delete: () => paths.id().concat('/delete'),
  minimalList: () => paths.root.concat('/list'),
  tree: () => paths.root.concat('/tree'),
  slug: () => paths.root.concat('/slug/{slug}'),
}

const list = createRoute({
  tags,
  path: paths.root,
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

const minimalList = createRoute({
  tags,
  path: paths.minimalList(),
  method: 'get',
  request: {
    query: z.object({
      'not-root': z.coerce.boolean().optional().openapi('Is not root categories')
    })
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getSuccessResponseSchema(z.array(categoryMinimalSchema)),
      'The list of minimal brands',
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorResponseSchema,
      'Error when getting a list of minimal brands',
    ),
  }
})

const tree = createRoute({
  tags,
  path: paths.tree(),
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
  path: paths.id(),
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

const getBySlug = createRoute({
  tags,
  path: paths.slug(),
  method: 'get',
  request: {
    params: SlugParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getSuccessResponseSchema(categorySelectSchema),
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
  path: paths.create(),
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
      'Error when creating a category',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorResponseSchema,
      'Error when creating a category',
    ),
  },
})

const update = createRoute({
  tags,
  path: paths.update(),
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
  minimalList,
  tree,
  get,
  getBySlug,
  create,
  update,
  delete: deleteCategory
}

export type ListRoute = typeof list
export type MinimalListRoute = typeof minimalList
export type TreeRoute = typeof tree
export type GetRoute = typeof get
export type GetBySlugRoute = typeof getBySlug
export type CreateRoute = typeof create
export type UpdateRoute = typeof update
export type DeleteRoute = typeof deleteCategory
