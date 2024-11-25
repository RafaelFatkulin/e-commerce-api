import {pgTable, timestamp, varchar} from "drizzle-orm/pg-core";
import {createId} from "@paralleldrive/cuid2";

export const user = pgTable(
    'users',
    {
        id: varchar('id')
            .$default(() => createId())
            .primaryKey(),
        fullName: varchar('fullName')
            .notNull(),
        email: varchar('email')
            .notNull()
            .unique(),
        password: varchar('password')
            .notNull(),
        salt: varchar('salt', {length: 64})
            .notNull(),
        createdAt: timestamp('createdAt')
            .defaultNow()
            .notNull(),
    }
)

export const Table = {user} as const

export type Table = typeof Table