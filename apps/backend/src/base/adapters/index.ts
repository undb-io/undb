import type { Provider } from '@nestjs/common'
import { BASE_QUERY_MODEL, NestBaseSqliteQueryModel } from './base-sqlite.query-model.js'
import { BASE_REPOSITORY, NestBaseSqliteRepository } from './base-sqlite.repository.js'

export const dbAdapters: Provider[] = [
  {
    provide: BASE_QUERY_MODEL,
    useClass: NestBaseSqliteQueryModel,
  },
  {
    provide: BASE_REPOSITORY,
    useClass: NestBaseSqliteRepository,
  },
]
