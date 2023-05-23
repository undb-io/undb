import { Inject } from '@nestjs/common'
import { registerAs } from '@nestjs/config'

export const InjectObjectStorageConfig = () => Inject(objectStorageConfig.KEY)

export const objectStorageConfig = registerAs('object-storage', () => ({
  provider: process.env.UNDB_OBJECT_STORAGE_PROVIDER! as 'local' | 's3',
  local: {
    path: process.env.UNDB_OBJECT_STORAGE_LOCAL_PATH!,
  },
  s3: {
    endpoint: process.env.UNDB_S3_ENDPOINT,
    bucket: process.env.UNDB_S3_BUCKET!,
    access_key: process.env.UNDB_S3_ACCESS_KEY,
    access_secret: process.env.UNDB_S3_ACCESS_SECRET,
  },
}))
