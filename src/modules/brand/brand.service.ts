import type { SQL } from 'drizzle-orm'
import type { BrandsFIlter } from './brand.types'
import { db } from '@database'
import { table } from '@database/schemas'

export async function getBrands(filter: BrandsFIlter) {
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
    limit: page ? per_page : undefined,
    offset: page ? (page - 1) * per_page : undefined,
  })

  return {
    data: brands,
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
