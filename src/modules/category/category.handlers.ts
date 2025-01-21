import type { AppRouteHandler } from 'types'
import type { GetRoute, ListRoute } from './category.routes'
import { createErrorResponse, createSuccessResponse } from '@utils/response'
import { HttpStatusCodes } from '@utils/status-codes'
import { getCategories, getCategoryById } from './category.service'

const list: AppRouteHandler<ListRoute> = async (c) => {
  const { tree } = c.req.valid('query')
  const categories = await getCategories(tree)

  try {
    return c.json(
      createSuccessResponse({ data: categories }),
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
    const category = await getCategoryById(id).catch(console.error)

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

export const handlers = {
  list,
  get,
}
