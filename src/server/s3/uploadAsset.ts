import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3Client } from './client'
import { s3Env } from './env'

type UploadAssetParams = {
  key: string
  body: Buffer | string
  contentType: string
}

export async function uploadAsset({
  key,
  body,
  contentType,
}: UploadAssetParams) {
  const command = new PutObjectCommand({
    Bucket: s3Env.bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
  })

  await s3Client.send(command)

  return {
    key,
    url: `${s3Env.assetBaseUrl}/${key}`,
  }
}
