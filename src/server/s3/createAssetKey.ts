type CreateAssetKeyParams = {
  title: string
  extension: string
  prefix: string
}

export function createAssetKey({
  title,
  extension,
  prefix,
}: CreateAssetKeyParams) {
  const timestamp = new Date().toISOString().slice(0, 10)

  const slug = title
    .toLowerCase()
    .trim()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${prefix}/${timestamp}-${slug}.${extension}`
}
