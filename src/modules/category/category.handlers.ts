import type { AppRouteHandler } from 'types'
import type {
  CreateRoute,
  DeleteRoute,
  GetBySlugRoute,
  GetRoute,
  ListRoute,
  MinimalListRoute,
  TreeRoute,
  UpdateRoute
} from './category.routes'
import { createErrorResponse, createSuccessResponse } from '@utils/response'
import { HttpStatusCodes } from '@utils/status-codes'
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoriesTree,
  getCategoryById,
  getCategoryBySlug,
  getCategoryByTitle,
  getCategoryChildCount,
  getCategoryList,
  updateCategory
} from './category.service'
import { db } from '@database'
import { table } from '@database/schemas'
import { eq } from 'drizzle-orm'

const list: AppRouteHandler<ListRoute> = async (c) => {
  const filters = c.req.valid('query')
  const { data, meta } = await getCategories(filters)

  try {
    return c.json(
      createSuccessResponse({ data, meta }),
      HttpStatusCodes.OK,
    )
  }
  catch {
    return c.json(
      createErrorResponse({ message: 'Ошибка при получении категорий' }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }
}

const minimalList: AppRouteHandler<MinimalListRoute> = async (c) => {
  const { "not-root": isNotRoot } = c.req.valid('query')

  try {
    const categories = await getCategoryList(isNotRoot)

    return c.json(
      createSuccessResponse({ data: categories }),
      HttpStatusCodes.OK,
    )
  }
  catch {
    return c.json(
      createErrorResponse({ message: 'Ошибка при загрузке категорий' }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }
}

const tree: AppRouteHandler<TreeRoute> = async (c) => {
  try {
    const { category_id } = c.req.valid('query')

    const data = await getCategoriesTree(category_id)

    return c.json(
      createSuccessResponse({ data }),
      HttpStatusCodes.OK,
    )
  }
  catch {
    return c.json(
      createErrorResponse({ message: 'Ошибка при получении категорий' }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }
}

const get: AppRouteHandler<GetRoute> = async (c) => {
  const { id } = c.req.valid('param')

  try {
    const category = await getCategoryById(id)

    if (!category) {
      return c.json(
        createErrorResponse({ message: 'Категория не найдена' }),
        HttpStatusCodes.NOT_FOUND,
      )
    }

    return c.json(
      createSuccessResponse({ data: category }),
      HttpStatusCodes.OK,
    )
  }
  catch {
    return c.json(
      createErrorResponse({ message: 'Ошибка при получении категории' }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }
}

const getBySlug: AppRouteHandler<GetBySlugRoute> = async (c) => {
  const { slug } = c.req.valid('param')

  try {
    const category = await getCategoryBySlug(slug)

    if (!category) {
      return c.json(
        createErrorResponse({ message: 'Категория не найдена' }),
        HttpStatusCodes.NOT_FOUND,
      )
    }

    return c.json(
      createSuccessResponse({ data: category }),
      HttpStatusCodes.OK,
    )
  }
  catch {
    return c.json(
      createErrorResponse({ message: 'Ошибка при получении категории' }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }
}

const create: AppRouteHandler<CreateRoute> = async (c) => {
  const data = c.req.valid('json')

  const existingCategory = await getCategoryByTitle(data.title)

  if (existingCategory) {
    return c.json(
      createErrorResponse({
        message: `Категория с "${data.title}" уже существует`,
      }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }

  try {
    const [category] = await createCategory(data)

    return c.json(
      createSuccessResponse({
        message: `Категория "${category.title}" создана`,
        data: category,
      }),
      HttpStatusCodes.CREATED,
    )
  }
  catch {
    return c.json(
      createErrorResponse({ message: 'Ошибка при создании категории' }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }
}

const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid('param')
  const data = c.req.valid('json')

  const existingCategory = await getCategoryById(id)

  if (!existingCategory) {
    return c.json(
      createErrorResponse({
        message: 'Категория не найдена',
      }),
      HttpStatusCodes.NOT_FOUND,
    )
  }

  if (data.title) {
    const categoryWithTitle = await getCategoryByTitle(data.title)

    if (categoryWithTitle && categoryWithTitle.id !== id) {
      return c.json(
        createErrorResponse({
          message: 'Категория с таким названием уже существует',
        }),
        HttpStatusCodes.BAD_REQUEST,
      )
    }
  }

  try {
    const [updatedCategory] = await updateCategory(id, data)

    return c.json(
      createSuccessResponse({
        message: `Информация о категории обновлена`,
        data: updatedCategory,
      }),
      HttpStatusCodes.OK,
    )
  }
  catch (error) {
    return c.json(
      createErrorResponse({
        message: 'Ошибка при редактировании категории',
      }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }
}

const deleteCategoryHandler: AppRouteHandler<DeleteRoute> = async (c) => {
  const { id } = c.req.valid('param')
  const existingCategory = await getCategoryById(id)

  if (!existingCategory) {
    return c.json(
      createErrorResponse({
        message: 'Категория не существует',
      }),
      HttpStatusCodes.NOT_FOUND,
    )
  }

  const childCount = await getCategoryChildCount(id)

  if (childCount > 0) {
    return c.json(
      createErrorResponse({ message: `Категория "${existingCategory.title}" не может быть удалена пока у нее есть хотя бы одна подкатегория` }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }

  try {
    const [category] = await deleteCategory(id)

    await db
      .update(table.products)
      .set({ status: 'not-active' })
      .where(eq(
        table.products.categoryId,
        category.id
      ))

    return c.json(
      createSuccessResponse({
        message: `Категория "${category.title}" удалена  `,
        data: category,
      }),
      HttpStatusCodes.OK,
    )
  }
  catch {
    return c.json(
      createErrorResponse({ message: 'Ошибка при удалении категории' }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }
}

export const handlers = {
  list,
  tree,
  get,
  getBySlug,
  create,
  update,
  delete: deleteCategoryHandler,
  minimalList
}
