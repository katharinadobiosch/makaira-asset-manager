import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'node:fs/promises'
import path from 'node:path'

import { createAssetKey } from '@/server/s3/createAssetKey'
import { s3Env } from '@/server/s3/env'
import { uploadAsset } from '@/server/s3/uploadAsset'
import { validateFolderName } from '@/components/AssetManager/utils/folderValidation'

export const config = {
  api: {
    bodyParser: false,
  },
}

type FormFields = {
  title?: string[]
  alt?: string[]
  folder?: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const form = formidable({ multiples: false })

  const [fields, files] = await form.parse(req)

  const title = (fields as FormFields).title?.[0]
  const alt = (fields as FormFields).alt?.[0]
  const folder = (fields as FormFields).folder?.[0]
  const file = Array.isArray(files.file) ? files.file[0] : files.file

  if (!title || !alt || !folder || !file) {
    return res.status(400).json({
      message: 'Missing title, alt, folder or file',
    })
  }

  const normalizedFolder = folder.trim()

  const folderValidationError = validateFolderName(normalizedFolder)

  if (folderValidationError) {
    return res.status(400).json({
      message: folderValidationError,
    })
  }

  const fileBuffer = await fs.readFile(file.filepath)
  const extension = path.extname(file.originalFilename ?? '').replace('.', '')

  const folderPrefix = `${s3Env.prefix}/${normalizedFolder}`

  const imageKey = createAssetKey({
    title,
    extension,
    prefix: folderPrefix,
  })

  const imageUpload = await uploadAsset({
    key: imageKey,
    body: fileBuffer,
    contentType: file.mimetype ?? 'application/octet-stream',
  })

  const metadataKey = imageKey.replace(/\.[^.]+$/, '.json')

  const metadata = {
    title,
    alt,
    folder: normalizedFolder,
    imageKey,
    metadataKey,
    url: imageUpload.url,
    uploadedAt: new Date().toISOString(),
  }

  await uploadAsset({
    key: metadataKey,
    body: JSON.stringify(metadata, null, 2),
    contentType: 'application/json',
  })

  return res.status(201).json({
    asset: metadata,
  })
}
