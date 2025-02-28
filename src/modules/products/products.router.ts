import { createRoute, z } from "@hono/zod-openapi"
import { productCreateSchema, productSelectSchema, productsFilterSchema, productUpdateSchema } from "./products.schema"
import { IdParamsSchema, SlugParamsSchema } from "@utils/zod"
import { HttpStatusCodes } from "@utils/status-codes"
import { jsonContent } from "@helpers/json-content"
import { errorResponseSchema, getSuccessResponseSchema } from "@utils/response"
import { jsonContentRequired } from "@helpers/json-content-required"

const tags = ['Products']
const paths = {
    root: '/products',
    id: () => paths.root.concat('/{id}'),
    slug: () => paths.root.concat('/slug/{slug}'),
    create: () => paths.root,
    edit: () => paths.id().concat('/edit'),
    delete: () => paths.id().concat('/delete'),
}

export const routes = {
    list: createRoute({
        tags,
        path: paths.root,
        method: 'get',
        request: { query: productsFilterSchema },
        responses: {
            [HttpStatusCodes.OK]: jsonContent(
                getSuccessResponseSchema(z.array(productSelectSchema)),
                'The list of products',
            ),
            [HttpStatusCodes.BAD_REQUEST]: jsonContent(
                errorResponseSchema,
                'Error when getting a products',
            ),
        }
    }),
    get: createRoute({
        tags,
        path: paths.id(),
        method: 'get',
        request: {
            params: IdParamsSchema
        },
        responses: {
            [HttpStatusCodes.OK]: jsonContent(
                getSuccessResponseSchema(productSelectSchema),
                'Product successfully found',
            ),
            [HttpStatusCodes.NOT_FOUND]: jsonContent(
                errorResponseSchema,
                'Product not found',
            ),
            [HttpStatusCodes.BAD_REQUEST]: jsonContent(
                errorResponseSchema,
                'Error when getting a product',
            ),
        }
    }),
    getBySlug: createRoute({
        tags,
        path: paths.slug(),
        method: 'get',
        request: {
            params: SlugParamsSchema
        },
        responses: {
            [HttpStatusCodes.OK]: jsonContent(
                getSuccessResponseSchema(productSelectSchema),
                'Product successfully found',
            ),
            [HttpStatusCodes.NOT_FOUND]: jsonContent(
                errorResponseSchema,
                'Product not found',
            ),
            [HttpStatusCodes.BAD_REQUEST]: jsonContent(
                errorResponseSchema,
                'Error when getting a product',
            ),
        }
    }),
    create: createRoute({
        tags,
        path: paths.create(),
        method: 'post',
        request: {
            body: jsonContentRequired(productCreateSchema, 'Product\'s data to create')
        },
        responses: {
            [HttpStatusCodes.CREATED]: jsonContent(
                getSuccessResponseSchema(productSelectSchema),
                'Product successfully created',
            ),
            [HttpStatusCodes.BAD_REQUEST]: jsonContent(
                errorResponseSchema,
                'Error when creating a product',
            ),
            [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
                errorResponseSchema,
                'Error when creating a product',
            ),
        }
    }),
    edit: createRoute({
        tags,
        path: paths.edit(),
        method: 'patch',
        request: {
            params: IdParamsSchema,
            body: jsonContentRequired(productUpdateSchema, 'Product\'s edit schema')
        },
        responses: {
            [HttpStatusCodes.OK]: jsonContent(
                getSuccessResponseSchema(productSelectSchema),
                'Product successfully updated',
            ),
            [HttpStatusCodes.NOT_FOUND]: jsonContent(
                errorResponseSchema,
                'Product not found',
            ),
            [HttpStatusCodes.BAD_REQUEST]: jsonContent(
                errorResponseSchema,
                'Error when editing a product',
            ),
        }
    }),
    delete: createRoute({
        tags,
        path: paths.delete(),
        method: 'delete',
        request: {
            params: IdParamsSchema
        },
        responses: {
            [HttpStatusCodes.OK]: jsonContent(
                getSuccessResponseSchema(productSelectSchema),
                'Product successfully deleted',
            ),
            [HttpStatusCodes.NOT_FOUND]: jsonContent(
                errorResponseSchema,
                'Product not found',
            ),
            [HttpStatusCodes.BAD_REQUEST]: jsonContent(
                errorResponseSchema,
                'Error when deleting a product',
            ),
        }
    }),
}

export type ListRoute = typeof routes.list
export type GetRoute = typeof routes.get
export type GetBySlugRoute = typeof routes.getBySlug
export type CreateRoute = typeof routes.create
export type EditRoute = typeof routes.edit
export type DeleteRoute = typeof routes.delete