import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TableModule } from '../core/table/table.module.js'
import { adapters } from './adapters/index.js'
import { commands } from './commands/index.js'
import { providers } from './providers.js'
import { NestWebhookEventHandler } from './webhook.event-handler.js'

@Module({
  imports: [CqrsModule, TableModule],
  providers: [NestWebhookEventHandler, ...providers, ...adapters, ...commands],
})
export class WebhookModule {}
