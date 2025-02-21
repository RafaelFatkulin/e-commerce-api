import { relations } from "drizzle-orm";
import { brandsMedia } from "./brands-media";
import { media } from "./media";
import { brands } from "./brands";

export const brandsMediaRelations = relations(brandsMedia, ({ one }) => ({
    media: one(media, {
        fields: [brandsMedia.mediaId],
        references: [media.id]
    }),
    brand: one(brands, {
        fields: [brandsMedia.brandId],
        references: [brands.id]
    })
}))