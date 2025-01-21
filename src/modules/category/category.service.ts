import type { Category, CreateCategory, UpdateCategory } from './category.type'
import { db } from '@database'
import { table } from '@database/schemas'
import { eq } from 'drizzle-orm'

function buildTree(categories: Category[], parentId: number | null = null): Category[] {
  return categories
    .filter(category => category.parentId === parentId)
    .map(category => ({
      ...category,
      categories: buildTree(categories, category.id),
    }))
    .sort((a, b) => (b.order ?? -Infinity) - (a.order ?? -Infinity))
}

export async function getCategories(tree: boolean = false) {
  const categories = await db.query.categories.findMany({
    where({ isActive }, { eq }) {
      return eq(isActive, true)
    },
    orderBy({ id, order }, { desc }) {
      return [desc(order), desc(id)]
    },
  })

  return tree ? buildTree(categories) : categories
}

export async function getCategoryById(id: number) {
  return db
    .query
    .categories
    .findFirst({
      where({ id: categoryId }, { eq }) {
        return eq(categoryId, id)
      },
    })
}

export async function createCategory(data: CreateCategory) {
  return db
    .insert(table.categories)
    .values(data)
    .returning()
}

export async function updateCategory(id: number, data: UpdateCategory) {
  return db
    .update(table.categories)
    .set(data)
    .where(eq(table.categories.id, id))
    .returning()
}

export async function deleteCategory(id: number) {
  return db
    .delete(table.categories)
    .where(eq(table.categories.id, id))
    .returning()
}
