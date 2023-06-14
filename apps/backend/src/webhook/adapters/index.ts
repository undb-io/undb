import { Provider } from '@nestjs/common'
import { NestWebhookSqliteRepository, WEBHOOK_REPOSITORY } from './webhook-sqlite.repository.js'

export const adapters: Provider[] = [
  {
    provide: WEBHOOK_REPOSITORY,
    useClass: NestWebhookSqliteRepository,
  },
]
