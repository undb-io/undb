import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { CacheModule } from '../../cache/cache.module.js'
import { TableAdapterModule } from '../../core/table/adapters/table-adapter.module.js'
import { adapters } from './adapters/index.js'
import { commandHandlers } from './commands/index.js'
import { queryHandlers } from './queries/index.js'
import { NestRLSAuthzService } from './rls-authz.service.js'
import { NestRLSQueryService } from './rls-query.service.js'
import { NestRLSRecordSpecService } from './rls-record-spec.service.js'

@Module({
  imports: [CqrsModule, CacheModule, TableAdapterModule],
  providers: [
    ...adapters,
    ...commandHandlers,
    ...queryHandlers,
    NestRLSRecordSpecService,
    NestRLSAuthzService,
    NestRLSQueryService,
  ],
  exports: [NestRLSRecordSpecService, NestRLSAuthzService, NestRLSQueryService],
})
export class RLSModule {}
