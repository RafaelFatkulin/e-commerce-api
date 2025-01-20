import { relations } from 'drizzle-orm'
import { categories } from './category'
import { products } from './products'

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  products: many(products),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'categories',
  }),
  categories: many(categories, {
    relationName: 'categories',
  }),
}))
