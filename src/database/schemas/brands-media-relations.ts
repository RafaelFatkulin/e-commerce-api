import { relations } from 'drizzle-orm'
import { brands } from './brands'
import { brandsMedia } from './brands-media'
import { media } from './media'

export const brandsMediaRelations = relations(brandsMedia, ({ one }) => ({
  media: one(media, {
    fields: [brandsMedia.mediaId],
    references: [media.id],
  }),
  brand: one(brands, {
    fields: [brandsMedia.brandId],
    references: [brands.id],
  }),
}))
