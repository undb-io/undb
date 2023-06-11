import { RedisHealthModule } from '@liaoliaots/nestjs-redis-health'
import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { StorageModule } from '../storage/storage.module.js'
import { HealthController } from './health.controller.js'

@Module({
  imports: [TerminusModule, StorageModule, RedisHealthModule],
  controllers: [HealthController],
})
export class HealthModule {}
