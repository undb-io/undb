import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TableModule } from '../core/table/table.module.js'
import { adapters } from './adapters/index.js'
import { commands } from './commands/index.js'
import { events } from './events/index.js'
import { providers } from './providers.js'
import { queries } from './queries/index.js'
import { WebhookSignatureService } from './webhook-signature.service.js'

@Module({
  imports: [CqrsModule, TableModule],
  providers: [WebhookSignatureService, ...events, ...providers, ...adapters, ...commands, ...queries],
})
export class WebhookModule {}
