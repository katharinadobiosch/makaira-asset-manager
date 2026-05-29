import { S3Client } from '@aws-sdk/client-s3'
import { s3Env } from './env'

export const s3Client = new S3Client({
  region: s3Env.region,
  credentials: {
    accessKeyId: s3Env.accessKeyId,
    secretAccessKey: s3Env.secretAccessKey,
  },
})
