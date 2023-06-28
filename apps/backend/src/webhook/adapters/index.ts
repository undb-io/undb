import type { Provider } from '@nestjs/common'
import { NestWebhookSqliteQueryModel, WEBHOOK_QUERY_MODEL } from './webhook-sqlite.query-model.js'
import { NestWebhookSqliteRepository, WEBHOOK_REPOSITORY } from './webhook-sqlite.repository.js'

export const adapters: Provider[] = [
  {
    provide: WEBHOOK_REPOSITORY,
    useClass: NestWebhookSqliteRepository,
  },
  {
    provide: WEBHOOK_QUERY_MODEL,
    useClass: NestWebhookSqliteQueryModel,
  },
]
