import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { WebhookEventHandler } from './webhook.event-handler.js'

@Module({
  imports: [CqrsModule],
  providers: [WebhookEventHandler],
})
export class WebhookModule {}
