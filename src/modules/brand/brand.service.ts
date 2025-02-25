import type {
  Brand,
  BrandsFilter,
  BrandWithMedia,
  BrandWithMediaOnly,
  CreateBrand,
  UpdateBrand
} from './brand.types'
import { db } from '@database'
import { table } from '@database/schemas'
import { translit } from '@utils/translit'
import { eq, type SQL } from 'drizzle-orm'

function getMappedBrands(brands: BrandWithMedia[]): BrandWithMediaOnly[] {
  return brands.map(brand => ({
    ...brand,
    media: brand.media.map(bm => bm.media).sort((a, b) => a.order - b.order),
  }))
}

function getMappedBrand(brand: BrandWithMedia): BrandWithMediaOnly {
  return {
    ...brand,
    media: brand.media.map(bm => bm.media).sort((a, b) => a.order - b.order),
  };
}

export async function getBrands(filter: BrandsFilter) {
  const {
    q,
    page,
    per_page = 10,
    sort_by = 'id',
    sort_order = 'desc',
  } = filter

  const totalCount = await db.$count(table.brands)
  const totalPages = Math.ceil(totalCount / per_page)

  const brands = await db.query.brands.findMany({
    where(fields, operators) {
      const conditions: SQL[] = []

      if (q) {
        conditions.push(operators.ilike(fields.title, `%${q.toLowerCase()}%`))
      }
      return conditions.length ? operators.or(...conditions) : undefined
    },
    orderBy(fields, operators) {
      return sort_order === 'asc'
        ? operators.asc(fields[sort_by])
        : operators.desc(fields[sort_by])
    },
    with: {
      media: {
        with: {
          media: true
        }
      }
    },
    limit: page ? per_page : undefined,
    offset: page ? (page - 1) * per_page : undefined,
  })

  return {
    data: getMappedBrands(brands),
    meta: page
      ? {
        total: totalCount,
        totalPages,
        limit: per_page,
        page,
      }
      : undefined,
  }
}

export async function getBrandById(brandId: number) {
  const brand = await db.query.brands.findFirst({
    where({ id }, { eq }) {
      return eq(id, brandId)
    },
    with: {
      media: {
        with: {
          media: true
        }
      }
    }
  })

  if (!brand) {
    return
  }

  return getMappedBrand(brand)
}

export async function getBrandByTitle(brandTitle: string) {
  return db.query.brands.findFirst({
    where({ title }, { eq }) {
      return eq(title, brandTitle)
    },
  })
}

export async function createBrand(data: CreateBrand) {
  return db.insert(table.brands).values({
    ...data,
    slug: translit(data.title.toLowerCase()),
    order: data.order || 1,
    status: data.status || 'active',
  }).returning()
}

export async function updateBrand(brandId: number, data: UpdateBrand) {
  return db
    .update(table.brands)
    .set({
      ...data,
      ...(data.title && { slug: translit(data.title.toLowerCase()) }),
    })
    .where(eq(table.brands.id, brandId))
    .returning()
}

export async function deleteBrand(brandId: number) {
  return db
    .delete(table.brands)
    .where(eq(table.brands.id, brandId))
    .returning()
}
