import { env } from 'node:process'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schemas'
import 'dotenv/config'

export const db = drizzle(env.DATABASE_URL!, {
  schema,
})
// function buildCategoryTree(categories) {
//   const categoryMap = new Map()
//   const tree = []

//   // Создаем карту категорий
//   categories.forEach((category) => {
//     categoryMap.set(category.id, { ...category, children: [] })
//   })

//   // Строим дерево
//   categories.forEach((category) => {
//     if (category.parent_id === null) {
//       tree.push(categoryMap.get(category.id))
//     }
//     else {
//       const parent = categoryMap.get(category.parent_id)
//       if (parent) {
//         parent.children.push(categoryMap.get(category.id))
//       }
//     }
//   })

//   return tree
// }
// async function getAllCategories() {
//   const query = sql`
//     WITH RECURSIVE category_tree AS (
//       SELECT 
//         id,
//         title,
//         description,
//         parent_id,
//         0 AS level
//       FROM 
//         categories
//       WHERE 
//         parent_id IS NULL  -- Начинаем с корневых категорий

//       UNION ALL

//       SELECT 
//         c.id,
//         c.title,
//         c.description,
//         c.parent_id,
//         ct.level + 1
//       FROM 
//         categories c
//       INNER JOIN 
//         category_tree ct ON c.parent_id = ct.id  -- Соединяем с родительскими категориями
//     )
//     SELECT * FROM category_tree;
//   `

//   const categoryTree = await db.execute(query)
//   return buildCategoryTree(categoryTree.rows)
// }
// // Использование функции
// (async () => {
//   const categoriesTree = await getAllCategories()
//   console.log(JSON.stringify(categoriesTree, null, 2))
// })()
