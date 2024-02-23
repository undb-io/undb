import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TableAdapterModule } from '../core/table/adapters/table-adapter.module.js'
import { UnitOfWorkModule } from '../uow/uow.module.js'
import { commands } from './commands/index.js'
import { sagas } from './sagas/index.js'
import { NestSearchService } from './search.service.js'

@Module({
  imports: [CqrsModule, TableAdapterModule, UnitOfWorkModule],
  providers: [NestSearchService, ...sagas, ...commands],
})
export class SearchModule {}
