const requiredEnvVars = [
  'AWS_REGION',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'S3_BUCKET_NAME',
  'S3_PREFIX',
  'S3_ASSET_BASE_URL',
] as const

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}

export const s3Env = {
  region: process.env.AWS_REGION!,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  bucketName: process.env.S3_BUCKET_NAME!,
  prefix: process.env.S3_PREFIX!,
  assetBaseUrl: process.env.S3_ASSET_BASE_URL!,
}
