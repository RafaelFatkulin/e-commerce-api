import { env } from 'node:process'
import { drizzle } from 'drizzle-orm/node-postgres'
import 'dotenv/config'

export const db = drizzle(env.DATABASE_URL!)
