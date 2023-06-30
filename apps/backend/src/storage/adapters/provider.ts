import type { Provider } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import { objectStorageConfig } from '../../configs/object-storage.config.js'
import { LocalObjectStorage } from './local-object-storage.js'
import { S3ObjectStorage } from './s3-object-storage.js'

const ObjectStorage = Symbol.for('ObjectStorage')

export const InjectObjectStorage = () => Inject(ObjectStorage)

export const objectStorage: Provider = {
  provide: ObjectStorage,
  useFactory: (config: ConfigType<typeof objectStorageConfig>, local: LocalObjectStorage, s3: S3ObjectStorage) => {
    if (config.provider === 's3') {
      return s3
    }
    return local
  },
  inject: [objectStorageConfig.KEY, LocalObjectStorage, S3ObjectStorage],
}

export const adapters = [LocalObjectStorage, S3ObjectStorage, objectStorage]
