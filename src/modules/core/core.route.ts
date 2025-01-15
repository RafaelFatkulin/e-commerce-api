import { jsonContent } from '@helpers/json-content'
import { createRoute, z } from '@hono/zod-openapi'
import { createRouter } from '@lib/create-app'
import { HttpStatusCodes } from '@utils/status-codes'

export const core = createRouter()
  .openapi(
    createRoute({
      tags: ['Index'],
      method: 'get',
      path: '/',
      responses: {
        [HttpStatusCodes.OK]: jsonContent(z.object({
          message: z.string(),
        }), 'E-commerce API index'),
      },
    }),
    (c) => {
      return c.json({
        message: 'E-commerce API',
      }, HttpStatusCodes.OK)
    },
  )
