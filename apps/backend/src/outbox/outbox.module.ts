import { Module } from '@nestjs/common'
import { NestOutboxService } from './outbox.service.js'

@Module({
  providers: [NestOutboxService],
  exports: [NestOutboxService],
})
export class OutboxModule {}
