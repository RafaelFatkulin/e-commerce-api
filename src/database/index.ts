import { env } from 'node:process'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schemas'
import 'dotenv/config'

export const db = drizzle(env.DATABASE_URL!, {
  schema,
});

(async () => {
  const categories = await db.query.categories.findMany({
    with: {
      categories: {
        with: { categories: true },
      },
      products: true,
      parent: {
        with: {
          products: true,
          parent: { // Добавлено для рекурсивного получения родительских продуктов
            with: {
              products: true,
              parent: { // Добавлено для рекурсивного получения родительских продуктов
                with: {
                  products: true,
                },
              },
            },
          },
        },
      },
    },
  })

  console.log(JSON.stringify(categories))
})()
