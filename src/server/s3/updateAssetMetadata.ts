import { getAssetMetadata } from './getAssetMetadata'
import { uploadAsset } from './uploadAsset'

export async function updateAssetMetadata(
  key: string,
  updates: Record<string, unknown>
) {
  const currentMetadata = await getAssetMetadata(key)

  const updatedMetadata = {
    ...currentMetadata,
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  await uploadAsset({
    key,
    body: JSON.stringify(updatedMetadata, null, 2),
    contentType: 'application/json',
  })

  return updatedMetadata
}
