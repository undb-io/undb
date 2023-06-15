import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { ScheduleModule } from '@nestjs/schedule'
import { OutboxModule } from '../outbox/outbox.module.js'
import { RelayService } from './relay.service.js'

@Module({
  imports: [ScheduleModule.forRoot(), CqrsModule, OutboxModule],
  providers: [RelayService],
})
export class RealyModule {}
