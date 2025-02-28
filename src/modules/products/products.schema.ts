import { table } from '@database/schemas'
import { productStatus } from '@database/schemas/products'
import { z } from '@hono/zod-openapi'
import { stringField } from '@utils/zod'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'

export const productStatusSchema = createSelectSchema(productStatus)

export const productSelectSchema = createSelectSchema(table.products)
    .openapi('Product schema')

export const productCreateSchema = createInsertSchema(table.products, {
    title: stringField(3, 128),
    slug: stringField().optional(),
    description: stringField(20, 3000),
    brandId: z.number({ message: 'ID бренда является обязательнам параметром' }),
    categoryId: z.number({ message: 'ID категории является обязательнам параметром' }),
    order: z.number().min(1, 'Минимальное значение поля - 1').nullable().optional(),
    status: productStatusSchema,
}).openapi('Product create schema')

export const productUpdateSchema = createUpdateSchema(table.products, {
    title: stringField(3, 128).optional(),
    slug: stringField().optional(),
    description: stringField(20, 3000).optional(),
    brandId: z.number({ message: 'ID бренда является обязательнам параметром' }).optional(),
    categoryId: z.number({ message: 'ID категории является обязательнам параметром' }).optional(),
    order: z.number().min(1, 'Минимальное значение поля - 1').optional(),
    status: productStatusSchema.optional(),
})

export const productsFilterSchema = z.object({
    q: z.string().optional().openapi('Search string'),
    category_id: z.coerce.number().optional(),
    brand_id: z.coerce.number().optional(),
    page: z.coerce.number().optional(),
    per_page: z.coerce.number().optional(),
    sort_by: productSelectSchema.keyof().optional(),
    sort_order: z.enum(['asc', 'desc']).optional(),
})
