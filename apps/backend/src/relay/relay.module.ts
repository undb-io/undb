import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ScheduleModule } from '@nestjs/schedule'
import { OutboxModule } from '../outbox/outbox.module.js'
import { RelayService } from './relay.service.js'

@Module({
  imports: [ScheduleModule.forRoot(), EventEmitterModule.forRoot(), OutboxModule],
  providers: [RelayService],
})
export class RealyModule {}
