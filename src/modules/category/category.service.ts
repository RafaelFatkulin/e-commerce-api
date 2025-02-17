import type { SQL } from 'drizzle-orm'
import type {
  CategoriesFilter,
  Category,
  CreateCategory,
  UpdateCategory,
} from './category.type'
import { db } from '@database'
import { table } from '@database/schemas'
import { translit } from '@utils/translit'
import { eq } from 'drizzle-orm'

export async function getCategories(filter: CategoriesFilter) {
  const {
    q,
    parent_id,
    page,
    per_page = 10,
    sort_by = 'id',
    sort_order = 'desc',
  } = filter

  console.log('@filter', filter);


  const totalCount = await db.$count(
    table.categories,
    parent_id
      ? eq(
        table.categories.parentId,
        parent_id,
      )
      : undefined,
  )
  const totalPages = Math.ceil(totalCount / per_page)

  const categories = await db.query.categories.findMany({
    with: {
      // categories: true
    },
    where(fields, { ilike, eq, or, isNull, and }) {
      const conditions: SQL[] = []
      if (q) {
        const searchQuery = q.trim().toLowerCase()
        conditions.push(
          or(
            ilike(fields.title, `%${searchQuery}%`),
            ilike(fields.shortTitle, `%${searchQuery}%`)
          ) as SQL
        )
      }
      if (parent_id !== undefined) {
        conditions.push(eq(fields.parentId, parent_id))
      } else {
        conditions.push(isNull(fields.parentId))
      }

      return conditions.length ? and(...conditions) : undefined
    },
    orderBy(fields, operators) {
      return sort_order === 'asc'
        ? operators.asc(fields[sort_by])
        : operators.desc(fields[sort_by])
    },
    limit: page ? per_page : undefined,
    offset: page ? (page - 1) * per_page : undefined,
  })

  console.log('@categories', categories);


  return {
    data: categories,
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

export async function getCategoryById(categoryId: number) {
  return db.query.categories.findFirst({
    where({ id }, { eq }) {
      return eq(id, categoryId)
    },
  })
}

export async function getCategoryByTitle(categoryTitle: string) {
  return db.query.categories.findFirst({
    where({ title }, { eq }) {
      return eq(title, categoryTitle)
    },
  })
}

export async function getCategoryBySlug(categorySlug: string) {
  return db.query.categories.findFirst({
    where({ slug }, { eq }) {
      return eq(slug, categorySlug)
    }
  })
}

export async function getCategoriesTree(categoryId?: number) {
  const categories = await db.query.categories.findMany()

  const categoryMap = new Map()

  categories.forEach((category) => {
    categoryMap.set(category.id, { ...category, categories: [] })
  })

  const tree: Category[] = []

  categories.forEach((category) => {
    if (category.parentId === null) {
      tree.push(categoryMap.get(category.id))
    }
    else {
      const parent = categoryMap.get(category.parentId)
      if (parent) {
        parent.categories.push(categoryMap.get(category.id))
      }
    }
  })

  console.log(categoryMap);


  if (categoryId) {
    const category = categoryMap.get(categoryId)
    if (!category) {
      throw new Error(`Category with id ${categoryId} not found`)
    }
    return category // Возвращаем только дерево для указанной категории
  }

  return tree
}

export async function createCategory(data: CreateCategory) {
  return db.insert(table.categories).values({
    ...data,
    shortTitle: data.shortTitle || data.title,
    slug: translit(data.title.toLowerCase()),
    order: data.order || 1,
    isActive: data.isActive || true,
  }).returning()
}

export async function updateCategory(categoryId: number, data: UpdateCategory) {
  return db
    .update(table.categories)
    .set({
      ...data,
      ...(data.title && { slug: translit(data.title.toLowerCase()) }),
    })
    .where(eq(table.categories.id, categoryId))
    .returning()
}

export async function deleteCategory(categoryId: number) {
  return db
    .delete(table.categories)
    .where(eq(table.categories.id, categoryId))
    .returning()
}
