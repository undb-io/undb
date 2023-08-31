import type { Provider } from '@nestjs/common'
import { FLS_CACHE, NestFLSKVCache } from './fls-kv.cache.js'
import { FLS_QUERY_MODEL, NestFLSSqliteQueryModel } from './fls-sqlite.query-model.js'
import { FLS_REPOSITORY, NestFLSSqliteRepository } from './fls-sqlite.repository.js'

export const adapters: Provider[] = [
  {
    provide: FLS_REPOSITORY,
    useClass: NestFLSSqliteRepository,
  },
  {
    provide: FLS_QUERY_MODEL,
    useClass: NestFLSSqliteQueryModel,
  },
  {
    provide: FLS_CACHE,
    useClass: NestFLSKVCache,
  },
]
