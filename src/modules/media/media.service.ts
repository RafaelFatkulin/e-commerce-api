import { db } from "@database";
import { table } from "@database/schemas";
import { Media, MediaSource, MediaStatus, MediaType } from "./media.type";

export async function uploadMedia(source: MediaSource, files: File[]) {
    const mediaItems: Media[] = []
    await Promise.all(
        files.map(async (file, index) => {
            const fileData = await file.arrayBuffer();
            const fileName = `${Date.now()}-${file.name}`;
            const filePath = `./uploads/${source}/${fileName}`;

            await Bun.write(filePath, fileData);

            const item = await db.insert(table.media).values({
                type: (file.type.startsWith('image') ? 'image' : 'video') as MediaType,
                path: filePath,
                order: index + 1,
                status: 'active' as MediaStatus,
                alt: file.name,
            }).returning();

            mediaItems.push(item[0])
        })
    );

    return mediaItems
}