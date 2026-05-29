import { GetObjectCommand } from '@aws-sdk/client-s3'
import { s3Client } from './client'
import { s3Env } from './env'

export async function getAssetMetadata(key: string) {
  const command = new GetObjectCommand({
    Bucket: s3Env.bucketName,
    Key: key,
  })

  const response = await s3Client.send(command)
  const body = await response.Body?.transformToString()

  if (!body) {
    throw new Error(`No metadata body found for key: ${key}`)
  }

  return JSON.parse(body)
}
