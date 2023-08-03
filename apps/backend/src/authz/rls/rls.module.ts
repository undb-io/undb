import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TableAdapterModule } from '../../core/table/adapters/table-adapter.module.js'
import { adapters } from './adapters/index.js'
import { commandHandlers } from './commands/index.js'
import { queryHandlers } from './queries/index.js'
import { NestRLSAuthzService } from './rls-authz.service.js'
import { NestRLSRecordSpecService } from './rls-record-spec.service.js'

@Module({
  imports: [CqrsModule, TableAdapterModule],
  providers: [...adapters, ...commandHandlers, ...queryHandlers, NestRLSRecordSpecService, NestRLSAuthzService],
  exports: [NestRLSRecordSpecService, NestRLSAuthzService],
})
export class RLSModule {}
