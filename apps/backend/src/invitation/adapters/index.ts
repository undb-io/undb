import type { Provider } from '@nestjs/common'
import { INVITATION_REPOSITORY, NestInvitationSqliteRepository } from './invitation-sqlite.repository.js'

export const adapters: Provider[] = [
  {
    provide: INVITATION_REPOSITORY,
    useClass: NestInvitationSqliteRepository,
  },
]
