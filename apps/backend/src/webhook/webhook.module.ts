import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { NestWebhookEventHandler } from './webhook.event-handler.js'

@Module({
  imports: [CqrsModule],
  providers: [NestWebhookEventHandler],
})
export class WebhookModule {}
