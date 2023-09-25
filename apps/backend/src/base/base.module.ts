import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TableAdapterModule } from '../core/table/adapters/table-adapter.module.js'
import { dbAdapters } from './adapters/index.js'
import { commands } from './commands/index.js'
import { queries } from './queries/index.js'

@Module({
  imports: [CqrsModule, TableAdapterModule],
  providers: [...dbAdapters, ...queries, ...commands],
})
export class BaseModule {}
