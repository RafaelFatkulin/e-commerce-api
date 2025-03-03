import type { z } from '@hono/zod-openapi'
import type { productCreateSchema, productSelectSchema, productsFilterSchema, productStatusSchema, productUpdateSchema, productWithInfoSchema } from './products.schema'

export type ProductStatus = z.output<typeof productStatusSchema>
export type Product = z.output<typeof productSelectSchema>
export type ProductWithInfo = z.output<typeof productWithInfoSchema>
export type ProductCreate = z.output<typeof productCreateSchema>
export type ProductUpdate = z.output<typeof productUpdateSchema>
export type ProductFilter = z.output<typeof productsFilterSchema>
