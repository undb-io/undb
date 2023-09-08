import type { Provider } from '@nestjs/common'
import { API_TOKEN_REPOSITORY, NestApiTokenSqliteRepository } from './api-token.sqlite-repository.js'

export const adapters: Provider[] = [
  {
    provide: API_TOKEN_REPOSITORY,
    useClass: NestApiTokenSqliteRepository,
  },
]
