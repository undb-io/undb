import { Provider } from '@nestjs/common'
import { NestRLSSqliteRepository, RLS_REPOSITORY } from './rls-sqlite.repository.js'

export const adapters: Provider[] = [
  {
    provide: RLS_REPOSITORY,
    useClass: NestRLSSqliteRepository,
  },
]
