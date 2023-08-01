import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TableAdapterModule } from '../../core/table/adapters/table-adapter.module.js'
import { adapters } from './adapters/index.js'
import { commandHandlers } from './commands/index.js'

@Module({
  imports: [CqrsModule, TableAdapterModule],
  providers: [...adapters, ...commandHandlers],
})
export class RLSModule {}
