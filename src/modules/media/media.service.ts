import type { Media, MediaOrderChange, MediaSource, MediaStatus, MediaType } from './media.type'
import { db } from '@database'
import { table } from '@database/schemas'
import { eq } from 'drizzle-orm'

export async function uploadMedia(source: MediaSource, files: File[]) {
  const mediaItems: Media[] = []
  await Promise.all(
    files.map(async (file, index) => {
      const fileData = await file.arrayBuffer()
      const fileName = `${Date.now()}-${file.name}`
      const filePath = `./uploads/${source}/${fileName}`

      await Bun.write(filePath, fileData)

      const item = await db.insert(table.media).values({
        type: (file.type.startsWith('image') ? 'image' : 'video') as MediaType,
        path: `/uploads/${source}/${fileName}`,
        order: 1,
        status: 'active' as MediaStatus,
        alt: file.name,
      }).returning()

      mediaItems.push(item[0])
    }),
  )

  return mediaItems
}

export async function getMediaById(id: number) {
  return await db.query.media.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id)
    },
  })
}

export async function changeMediaStatus(id: number, status: MediaStatus) {
  return await db.update(table.media).set({
    status,
  }).where(eq(table.media.id, id)).returning()
}

export async function deleteMediaById(id: number) {
  const [media] = await db.delete(table.media).where(eq(table.media.id, id)).returning()

  const file = Bun.file(`.${media?.path}`)

  if (!file.exists()) {
    return
  }

  await file.unlink()

  return media
}

export async function deleteMediaByPath(path: string) {
  const file = Bun.file(`.${path}`)

  await db.delete(table.media).where(eq(table.media.path, path)).returning()

  if (!file.exists()) {
    return
  }

  await file.unlink()
}

export async function updateMediaOrder(data: MediaOrderChange) {
  return await db.transaction(async (tx) => {
    await Promise.all(
      data.map(item => tx
        .update(table.media)
        .set({ order: item.order })
        .where(eq(table.media.id, item.id)),
      ),
    )
  })
}
