import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { adapters } from './adapters/index.js'
import { events } from './events/index.js'
import { queries } from './queries/index.js'

@Module({
  imports: [CqrsModule],
  providers: [...adapters, ...events, ...queries],
})
export class AuditModule {}
