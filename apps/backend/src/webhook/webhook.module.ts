import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { providers } from './providers.js'
import { NestWebhookEventHandler } from './webhook.event-handler.js'

@Module({
  imports: [CqrsModule, HttpModule],
  providers: [NestWebhookEventHandler, ...providers],
})
export class WebhookModule {}
