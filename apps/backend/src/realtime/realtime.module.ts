import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { events } from './events/index.js'
import { RealtimeController } from './realtime.controller.js'

@Module({
  imports: [CqrsModule],
  controllers: [RealtimeController],
  providers: [...events],
})
export class RealtimeModule {}
