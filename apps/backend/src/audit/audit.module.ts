import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { adapters } from './adapters/index.js'
import { NestAuditService } from './audit.service.js'
import { events } from './events/index.js'
import { queries } from './queries/index.js'

@Module({
  imports: [CqrsModule],
  providers: [NestAuditService, ...adapters, ...events, ...queries],
})
export class AuditModule {}
