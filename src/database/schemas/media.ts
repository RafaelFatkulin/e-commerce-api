import { integer, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";

export const mediaType = pgEnum('media_type', ['image', 'video'])
export const mediaStatus = pgEnum('media_status', ['active', 'not-active'])

export const media = pgTable('media', {
    id: integer().generatedAlwaysAsIdentity().primaryKey(),
    type: mediaType('type').notNull(),
    path: varchar('path', { length: 255 }).notNull(),
    alt: varchar('alt', { length: 255 }),
    order: integer('order').default(0),
    status: mediaStatus('status').default('active').notNull()
})

