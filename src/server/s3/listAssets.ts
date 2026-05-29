import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { s3Client } from './client'
import { s3Env } from './env'

export async function listAssets() {
  const command = new ListObjectsV2Command({
    Bucket: s3Env.bucketName,
    Prefix: `${s3Env.prefix}/`,
  })

  const response = await s3Client.send(command)

  return (response.Contents ?? []).filter((asset) => {
    return asset.Key !== `${s3Env.prefix}/`
  })
}
