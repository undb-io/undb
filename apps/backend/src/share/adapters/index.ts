import { Provider } from '@nestjs/common'
import { NestShareSqliteQueryModel, SHARE_QUERY_MODEL } from './share-sqlite.query-model.js'
import { NestShareSqliteRepository, SHARE_REPOSITORY } from './share-sqlite.repository.js'

export const adapters: Provider[] = [
  {
    provide: SHARE_REPOSITORY,
    useClass: NestShareSqliteRepository,
  },
  {
    provide: SHARE_QUERY_MODEL,
    useClass: NestShareSqliteQueryModel,
  },
]
