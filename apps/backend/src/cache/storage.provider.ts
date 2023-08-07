import type { Provider } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { PinoLogger } from 'nestjs-pino'
import { cacheStorageConfig } from '../configs/cache-storage.config.js'
import { cacheStorageFactory } from './cache-storage.factory.js'

export const STORAGE = Symbol('STORAGE')
export const InjectStorage = () => Inject(STORAGE)

export const storage: Provider = {
  provide: STORAGE,
  useFactory: cacheStorageFactory,
  inject: [PinoLogger, cacheStorageConfig.KEY],
}
