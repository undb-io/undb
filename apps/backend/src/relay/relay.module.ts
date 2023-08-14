import type { OnModuleInit } from '@nestjs/common'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { InjectOutboxConfig, type OutboxConfigType } from '../configs/outbox.config.js'
import { OutboxModule } from '../outbox/outbox.module.js'
import { RelayService } from './relay.service.js'
import { ReplyEventService } from './reply-event.service.js'

@Module({
  imports: [ScheduleModule.forRoot(), CqrsModule, OutboxModule],
  providers: [RelayService, ReplyEventService],
})
export class RelayModule implements OnModuleInit {
  constructor(
    @InjectPinoLogger(RelayModule.name)
    private readonly logger: PinoLogger,
    @InjectOutboxConfig()
    private readonly config: OutboxConfigType,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly service: RelayService,
  ) {}

  async onModuleInit() {
    const seconds = this.config.seconds
    const job = new CronJob(`*/${seconds} * * * * *`, () => {
      this.service.handleCron()
    })

    this.schedulerRegistry.addCronJob('outbox polling', job)
    job.start()

    this.logger.info('Added cron job for outbox polling')
  }
}
