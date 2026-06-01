import type { NextApiRequest, NextApiResponse } from 'next'

import { getAssets } from '@/server/s3/getAssets'
import { deleteAsset } from '@/server/s3/deleteAsset'

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

  return res.status(405).json({ message: 'Method not allowed' })
}
