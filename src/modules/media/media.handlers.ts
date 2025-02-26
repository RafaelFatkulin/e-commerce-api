import type { AppRouteHandler } from 'types'
import type { ChangeOrderRoute, ChangeStatusRoute, DeleteRoute } from './media.router'
import { createErrorResponse, createSuccessResponse } from '@utils/response'
import { HttpStatusCodes } from '@utils/status-codes'
import { changeMediaStatus, deleteMediaById, getMediaById, updateMediaOrder } from './media.service'

const changeOrder: AppRouteHandler<ChangeOrderRoute> = async (c) => {
  const data = c.req.valid('json')

  try {
    await updateMediaOrder(data)
    return c.json(
      createSuccessResponse({
        message: 'Порядок медиа-файлов изменен',
        data: null,
      }),
      HttpStatusCodes.OK,
    )
  }
  catch {
    return c.json(
      createErrorResponse({
        message: 'Ошибка при редактировании порядка медиа-файлов',
      }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }
}

const changeStatus: AppRouteHandler<ChangeStatusRoute> = async (c) => {
  const { id } = c.req.valid('param')
  const { status } = c.req.valid('json')

  try {
    const [media] = await changeMediaStatus(id, status)
    const message = status === 'active'
      ? `Медиа-файл "${media?.alt}" активен`
      : `Медиа-файл "${media?.alt}" неактивен`

    return c.json(
      createSuccessResponse({
        message,
        data: null,
      }),
      HttpStatusCodes.OK,
    )
  }
  catch {
    return c.json(
      createErrorResponse({
        message: 'Ошибка при редактировании статуса медиа-файла',
      }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }
}

const deleteMedia: AppRouteHandler<DeleteRoute> = async (c) => {
  const { id } = c.req.valid('param')
  const existingMedia = await getMediaById(id)

  if (!existingMedia) {
    return c.json(
      createErrorResponse({
        message: 'Медиа-файл не существует',
      }),
      HttpStatusCodes.NOT_FOUND,
    )
  }

  try {
    const media = await deleteMediaById(id)
    return c.json(
      createSuccessResponse({
        message: `Медиа-файл "${media?.alt}" удален`,
        data: null,
      }),
      HttpStatusCodes.OK,
    )
  }
  catch {
    return c.json(
      createErrorResponse({ message: 'Ошибка при удалении медиа-файла' }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }
}

export const handlers = {
  changeOrder,
  changeStatus,
  deleteMedia,
}
