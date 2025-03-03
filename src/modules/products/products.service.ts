import type { SuccessResponse } from '@utils/response'
import type { SQL } from 'drizzle-orm'
import type { Product, ProductCreate, ProductFilter, ProductUpdate, ProductWithInfo } from './products.type'
import { db } from '@database'
import { table } from '@database/schemas'
import { and, eq, ilike } from 'drizzle-orm'
import { translit } from '@utils/translit'

export async function getProducts(filter: ProductFilter) {
    const {
        q,
        page,
        per_page = 10,
        category_id,
        brand_id,
        sort_by = 'id',
        sort_order = 'desc',
    } = filter

    console.log({ filter });


    const whereConditions = (() => {
        const conditions: SQL[] = []

        const fields = table.products

        if (q)
            conditions.push(ilike(fields.title, `%${q.toLowerCase()}%`))
        if (brand_id)
            conditions.push(eq(fields.brandId, brand_id))
        if (category_id)
            conditions.push(eq(fields.categoryId, category_id))

        return conditions.length ? and(...conditions) : undefined
    })()

    const totalCount = await db.$count(
        table.products,
        whereConditions,
    )
    const totalPages = Math.ceil(totalCount / per_page)

    const products = await db.query.products.findMany({
        where: whereConditions,
        orderBy(fields, operators) {
            return sort_order === 'asc'
                ? operators.asc(fields[sort_by])
                : operators.desc(fields[sort_by])
        },
        limit: page ? per_page : undefined,
        offset: page ? (page - 1) * per_page : undefined,
        with: {
            brand: true,
            category: true
        }
    })

    return {
        data: products.map(product => ({ ...product, brand: product.brand?.title, category: product.category?.title })),
        meta: page
            ? {
                total: totalCount,
                totalPages,
                limit: per_page,
                page,
            }
            : undefined,
    } as SuccessResponse<ProductWithInfo[]>
}

export async function getProductById(productId: number) {
    return db.query.products.findFirst({
        where({ id }, { eq }) {
            return eq(id, productId)
        },
    })
}

export async function getProductByTitle(productTitle: string) {
    return db.query.products.findFirst({
        where({ title }, { eq }) {
            return eq(title, productTitle)
        }
    })
}

export async function getProductBySlug(productSlug: string) {
    return db.query.products.findFirst({
        where({ slug }, { eq }) {
            return eq(slug, productSlug)
        }
    })
}

export async function createProduct(data: ProductCreate) {
    return db.insert(table.products).values({
        ...data,
        slug: translit(data.title.toLowerCase()),
        order: data.order || 1,
        status: data.status || 'active'
    }).returning()
}

export async function updateProduct(productId: number, data: ProductUpdate) {
    return db
        .update(table.products)
        .set({
            ...data,
            ...(data.title && { slug: translit(data.title.toLowerCase()) })
        })
        .where(eq(table.products.id, productId))
        .returning()
}

export async function deleteProduct(productId: number) {
    return db
        .delete(table.products)
        .where(eq(table.products.id, productId))
        .returning()
}