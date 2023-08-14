import { RedisHealthModule } from '@liaoliaots/nestjs-redis-health'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { StorageModule } from '../storage/storage.module.js'
import { HealthController } from './health.controller.js'
import { MailHealthIndicator } from './mail.health.js'

@Module({
  imports: [TerminusModule, StorageModule, RedisHealthModule, HttpModule],
  providers: [MailHealthIndicator],
  controllers: [HealthController],
})
export class HealthModule {}
