import { relations } from 'drizzle-orm'
import { brands } from './brands'
import { categories } from './category'
import { products } from './producsts'

export const productsRelations = relations(products, ({ one }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}))
