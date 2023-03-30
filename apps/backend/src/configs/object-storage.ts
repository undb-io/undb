import { Inject } from '@nestjs/common'
import { registerAs } from '@nestjs/config'

export const InjectObjectStorageConfig = () => Inject(objectStorageConfig.KEY)

export const objectStorageConfig = registerAs('object-storage', () => ({
  provider: process.env.EGODB_OBJECT_STORAGE_PROVIDER,
  local: {
    path: process.env.EGODB_OBJECT_STORAGE_LOCAL_PATH!,
  },
}))
