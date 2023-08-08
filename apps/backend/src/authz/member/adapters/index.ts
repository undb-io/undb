import type { Provider } from '@nestjs/common'
import { MEMBER_REPOSITORY, NestMemberSqliteRepository } from './member-sqlite.respository.js'

export const adapters: Provider[] = [
  {
    provide: MEMBER_REPOSITORY,
    useClass: NestMemberSqliteRepository,
  },
]
