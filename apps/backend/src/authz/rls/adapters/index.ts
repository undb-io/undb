import type { Provider } from '@nestjs/common'
import { NestRLSKVCache, RLS_CACHE } from './rls-kv.cache.js'
import { NestRLSSqliteQueryModel, RLS_QUERY_MODEL } from './rls-sqlite.query-model.js'
import { NestRLSSqliteRepository, RLS_REPOSITORY } from './rls-sqlite.repository.js'

export const adapters: Provider[] = [
  {
    provide: RLS_REPOSITORY,
    useClass: NestRLSSqliteRepository,
  },
  {
    provide: RLS_QUERY_MODEL,
    useClass: NestRLSSqliteQueryModel,
  },
  {
    provide: RLS_CACHE,
    useClass: NestRLSKVCache,
  },
]
