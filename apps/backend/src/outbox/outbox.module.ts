import { Module } from '@nestjs/common'
import { UnitOfWorkModule } from '../uow/uow.module.js'
import { NestOutboxService } from './outbox.service.js'

@Module({
  imports: [UnitOfWorkModule],
  providers: [NestOutboxService],
  exports: [NestOutboxService],
})
export class OutboxModule {}
