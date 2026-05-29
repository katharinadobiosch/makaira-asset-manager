import { getAssetMetadata } from './getAssetMetadata'
import { listAssets } from './listAssets'

export async function getAssets() {
  const assets = await listAssets()

  const metadataFiles = assets.filter((asset) => {
    return asset.Key?.endsWith('.json')
  })

  const metadataList = []

  for (const asset of metadataFiles) {
    if (!asset.Key) continue

    const metadata = await getAssetMetadata(asset.Key)
    metadataList.push(metadata)
  }

  return metadataList
}
