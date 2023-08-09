import type { Provider } from '@nestjs/common'
import { MEMBER_QUERY_MODEL, NestMemberSqliteQueryModel } from './member-sqlite.query-model.js'
import { MEMBER_REPOSITORY, NestMemberSqliteRepository } from './member-sqlite.respository.js'

export const adapters: Provider[] = [
  {
    provide: MEMBER_REPOSITORY,
    useClass: NestMemberSqliteRepository,
  },
  {
    provide: MEMBER_QUERY_MODEL,
    useClass: NestMemberSqliteQueryModel,
  },
]
