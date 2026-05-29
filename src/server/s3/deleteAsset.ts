import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { s3Client } from './client'
import { s3Env } from './env'

export async function deleteObject(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: s3Env.bucketName,
    Key: key,
  })

  await s3Client.send(command)

  return {
    deletedKey: key,
  }
}

export async function deleteAsset(imageKey: string) {
  const metadataKey = imageKey.replace(/\.[^.]+$/, '.json')

  await deleteObject(imageKey)
  await deleteObject(metadataKey)

  return {
    deletedImageKey: imageKey,
    deletedMetadataKey: metadataKey,
  }
}
