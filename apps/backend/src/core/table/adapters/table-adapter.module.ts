import { Module } from '@nestjs/common'
import { OutboxModule } from '../../../outbox/outbox.module.js'
import { UnitOfWorkModule } from '../../../uow/uow.module.js'
import { dbAdapters } from './index.js'

@Module({
  imports: [UnitOfWorkModule, OutboxModule],
  providers: [...dbAdapters],
  exports: [...dbAdapters],
})
export class TableAdapterModule {}
