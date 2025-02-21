import { relations } from "drizzle-orm";
import { media } from "./media";
import { brandsMedia } from "./brands-media";

export const mediaRelations = relations(media, ({ many }) => ({
    brands: many(brandsMedia)
}))