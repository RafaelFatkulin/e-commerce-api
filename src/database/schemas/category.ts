import type { AnyPgColumn } from 'drizzle-orm/pg-core'
import { integer, pgEnum, pgTable, text, varchar } from 'drizzle-orm/pg-core'

export const categoryStatus = pgEnum('status', ['active', 'not-active'])
export const categories = pgTable('categories', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  shortTitle: varchar('short_title', { length: 128 }).notNull(),
  title: varchar('title', { length: 128 }).notNull().unique(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  parentId: integer('parent_id').references((): AnyPgColumn => categories.id),
  order: integer('order'),
  status: categoryStatus('status').notNull(),
})
