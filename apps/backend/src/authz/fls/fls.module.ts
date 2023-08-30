import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { CacheModule } from '../../cache/cache.module.js'
import { TableAdapterModule } from '../../core/table/adapters/table-adapter.module.js'
import { adapters } from './adapters/index.js'
import { commandHandlers } from './commands/index.js'
import { NestFLSAuthzService } from './fls-authz.service.js'
import { NestFLSQueryService } from './fls-query.service.js'

@Module({
  imports: [CqrsModule, CacheModule, TableAdapterModule],
  providers: [...adapters, ...commandHandlers, NestFLSQueryService, NestFLSAuthzService],
  exports: [NestFLSQueryService, NestFLSAuthzService],
})
export class FLSModule {}
