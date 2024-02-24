import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TableAdapterModule } from '../core/table/adapters/table-adapter.module.js'
import { UnitOfWorkModule } from '../uow/uow.module.js'
import { commands } from './commands/index.js'
import { events } from './events/index.js'
import { sagas } from './sagas/index.js'
import { NestSearchTableService } from './search-table.service.js'

@Module({
  imports: [CqrsModule, TableAdapterModule, UnitOfWorkModule],
  providers: [NestSearchTableService, ...sagas, ...commands, ...events],
})
export class SearchModule {}
