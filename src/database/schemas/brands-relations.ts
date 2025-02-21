import { relations } from 'drizzle-orm'
import { brands } from './brands'
import { products } from './products'
import { brandsMedia } from './brands-media'

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
  media: many(brandsMedia)
}))
