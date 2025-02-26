import { jsonContent } from '@helpers/json-content'
import { jsonContentRequired } from '@helpers/json-content-required'
import { createRoute } from '@hono/zod-openapi'
import { errorResponseSchema, getSuccessResponseSchema } from '@utils/response'
import { HttpStatusCodes } from '@utils/status-codes'
import { IdParamsSchema } from '@utils/zod'
import { mediaChangeStatusSchema, mediaOrderChangeSchema } from './media.schema'

const tags = ['Media']

const paths = {
  root: '/media',
  id: () => paths.root.concat('/{id}'),
  changeOrder: () => paths.root.concat('/change-order'),
  changeStatus: () => paths.id().concat('/change-status'),
  delete: () => paths.id().concat('/delete'),
}

export const routes = {
  changeOrder: createRoute({
    tags,
    path: paths.changeOrder(),
    method: 'post',
    request: {
      body: jsonContentRequired(
        mediaOrderChangeSchema,
        'Media order change schema',
      ),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        getSuccessResponseSchema(),
        'Media order changed',
      ),
      [HttpStatusCodes.BAD_REQUEST]: jsonContent(
        errorResponseSchema,
        'Error when changing media order',
      ),
    },
  }),
  changeStatus: createRoute({
    tags,
    path: paths.changeStatus(),
    method: 'patch',
    request: {
      params: IdParamsSchema,
      body: jsonContentRequired(
        mediaChangeStatusSchema,
        'Media change status schema',
      ),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        getSuccessResponseSchema(),
        'Media status changed',
      ),
      [HttpStatusCodes.BAD_REQUEST]: jsonContent(
        errorResponseSchema,
        'Error when updating media status',
      ),
    },
  }),
  deleteMedia: createRoute({
    tags,
    path: paths.delete(),
    method: 'delete',
    request: {
      params: IdParamsSchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        getSuccessResponseSchema(),
        'Media-file successfully deleted',
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(
        errorResponseSchema,
        'Media-file not found',
      ),
      [HttpStatusCodes.BAD_REQUEST]: jsonContent(
        errorResponseSchema,
        'Error when deleting a media-file',
      ),
    },
  }),
}

export type ChangeOrderRoute = typeof routes.changeOrder
export type ChangeStatusRoute = typeof routes.changeStatus
export type DeleteRoute = typeof routes.deleteMedia
