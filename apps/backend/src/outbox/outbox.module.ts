import { Module } from '@nestjs/common'
import { UnitOrWorkModule } from '../uow/uow.module.js'
import { NestOutboxService } from './outbox.service.js'

@Module({
  imports: [UnitOrWorkModule],
  providers: [NestOutboxService],
  exports: [NestOutboxService],
})
export class OutboxModule {}
