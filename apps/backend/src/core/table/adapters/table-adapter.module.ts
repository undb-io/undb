import { Module } from '@nestjs/common'
import { CacheModule } from '../../../cache/cache.module.js'
import { OutboxModule } from '../../../outbox/outbox.module.js'
import { UnitOfWorkModule } from '../../../uow/uow.module.js'
import { dbAdapters } from './index.js'

@Module({
  imports: [UnitOfWorkModule, OutboxModule, CacheModule],
  providers: [...dbAdapters],
  exports: [...dbAdapters],
})
export class TableAdapterModule {}
