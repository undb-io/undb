import type { Provider } from '@nestjs/common'
import { INVITATION_QUERY_MODEL, NestInvitationSqliteQueryModel } from './invitation-sqlite.query-model.js'
import { INVITATION_REPOSITORY, NestInvitationSqliteRepository } from './invitation-sqlite.repository.js'

export const adapters: Provider[] = [
  {
    provide: INVITATION_REPOSITORY,
    useClass: NestInvitationSqliteRepository,
  },
  {
    provide: INVITATION_QUERY_MODEL,
    useClass: NestInvitationSqliteQueryModel,
  },
]
