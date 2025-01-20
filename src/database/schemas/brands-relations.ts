import { relations } from 'drizzle-orm'
import { brands } from './brands'
import { products } from './products'

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}))
