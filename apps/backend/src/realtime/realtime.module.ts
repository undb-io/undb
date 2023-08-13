import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { RLSModule } from '../authz/rls/rls.module.js'
import { events } from './events/index.js'

@Module({
  imports: [CqrsModule, RLSModule],
  providers: [...events],
  exports: [...events],
})
export class RealtimeModule {}
