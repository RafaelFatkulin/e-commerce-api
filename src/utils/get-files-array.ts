export function getFilesArray(body: FormData): File[] {
    const files: File[] = [];

    const possibleFileFields = ['files', 'file', 'media', 'uploads'];

    for (const [key, value] of body.entries()) {
        if (value instanceof File && value.size > 0) { // Also check if file has content
            files.push(value);
        }
    }

    const filesFromSpecificField = body.getAll('files'); // or whatever your field name is
    if (filesFromSpecificField.length > 0) {
        filesFromSpecificField.forEach((file) => {
            if (file instanceof File) files.push(file);
        });
    }

    return files;
}