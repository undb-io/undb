import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { CacheModule } from '../../cache/cache.module.js'
import { TableAdapterModule } from '../../core/table/adapters/table-adapter.module.js'
import { adapters } from './adapters/index.js'
import { commandHandlers } from './commands/index.js'

@Module({
  imports: [CqrsModule, CacheModule, TableAdapterModule],
  providers: [...adapters, ...commandHandlers],
  exports: [],
})
export class FLSModule {}
