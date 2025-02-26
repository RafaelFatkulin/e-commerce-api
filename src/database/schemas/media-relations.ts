import { relations } from 'drizzle-orm'
import { brandsMedia } from './brands-media'
import { media } from './media'

export const mediaRelations = relations(media, ({ many }) => ({
  brands: many(brandsMedia),
}))
