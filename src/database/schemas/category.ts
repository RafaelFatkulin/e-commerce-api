import type { AnyPgColumn } from 'drizzle-orm/pg-core'
import { boolean, integer, pgTable, text, varchar } from 'drizzle-orm/pg-core'

export const categories = pgTable('categories', {
  id:          integer().generatedAlwaysAsIdentity().primaryKey(),
  title:       varchar('title', { length: 128 }).notNull(),
  description: text('description'),
  parentId:    integer('parent_id').references((): AnyPgColumn => categories.id),
  order:       integer('order').default(0),
  isActive:    boolean('is_active').default(true),
})
