import { relations } from 'drizzle-orm'
import { brands } from './brands'
import { brandsMedia } from './brands-media'
import { products } from './products'

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
  media: many(brandsMedia),
}))
