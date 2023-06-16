import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { events } from './events/index.js'

@Module({
  imports: [CqrsModule],
  providers: [...events],
  exports: [...events],
})
export class RealtimeModule {}
