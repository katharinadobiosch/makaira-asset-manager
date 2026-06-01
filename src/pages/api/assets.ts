import type { NextApiRequest, NextApiResponse } from 'next'

import { getAssets } from '@/server/s3/getAssets'
import { deleteAsset } from '@/server/s3/deleteAsset'
import { updateAssetMetadata } from '@/server/s3/updateAssetMetadata'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const assets = await getAssets()

    return res.status(200).json({
      assets,
    })
  }

  if (req.method === 'DELETE') {
    const { imageKey } = req.body

    if (!imageKey || typeof imageKey !== 'string') {
      return res.status(400).json({
        message: 'Missing imageKey',
      })
    }

    const result = await deleteAsset(imageKey)

    return res.status(200).json({
      deleted: result,
    })
  }

  if (req.method === 'PATCH') {
    const { metadataKey, title, alt } = req.body

    if (!metadataKey || typeof metadataKey !== 'string') {
      return res.status(400).json({
        message: 'Missing metadataKey',
      })
    }

    const updatedAsset = await updateAssetMetadata(metadataKey, {
      title,
      alt,
    })

    return res.status(200).json({
      asset: updatedAsset,
    })
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
