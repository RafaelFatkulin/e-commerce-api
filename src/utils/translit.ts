import cyrillicToTranslit from 'cyrillic-to-translit-js'

export function translit(str: string) {
  return cyrillicToTranslit({ preset: 'ru' })
    .transform(str, '-')
    .replaceAll('#', '')
    .replaceAll('№', '')
}
