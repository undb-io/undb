import type { Provider } from '@nestjs/common'
import { BASE_QUERY_MODEL, BaseSqliteQueryModel } from './base-sqlite.query-model.js'

export const dbAdapters: Provider[] = [
  {
    provide: BASE_QUERY_MODEL,
    useClass: BaseSqliteQueryModel,
  },
]
