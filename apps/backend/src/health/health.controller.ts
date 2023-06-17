import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis-health'
import { Controller, Get, OnModuleInit } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import { HealthCheck, HealthCheckService, HealthIndicatorFunction, MongooseHealthIndicator } from '@nestjs/terminus'
import { Connection as TemporalConnection } from '@temporalio/client'
import { Redis } from 'ioredis'
import { Connection, createConnection } from 'mongoose'
import { InjectCacheStorageConfig, cacheStorageConfig } from '../configs/cache-storage.config.js'
import { InjectWebhookConfig, type WebhookConfigType } from '../configs/webhook.config.js'
import { StorageHealthIndicator } from '../storage/storage.health.js'

@Controller('health')
export class HealthController implements OnModuleInit {
  redis: Redis | undefined
  mongo: Connection | undefined
  temporal: TemporalConnection | undefined
  constructor(
    private readonly health: HealthCheckService,
    private readonly storageHealth: StorageHealthIndicator,
    private readonly redisIndicator: RedisHealthIndicator,
    private readonly mongooseIndicator: MongooseHealthIndicator,
    @InjectCacheStorageConfig() private readonly cacheConfig: ConfigType<typeof cacheStorageConfig>,
    @InjectWebhookConfig() private readonly webhookConfig: WebhookConfigType,
  ) {}

  async onModuleInit() {
    const { cacheConfig, webhookConfig } = this

    if (cacheConfig.provider === 'redis') {
      this.redis = new Redis({
        host: cacheConfig.redis.host,
        password: cacheConfig.redis.password,
        port: cacheConfig.redis.port,
        connectTimeout: 10000,
      })
    }
    if (cacheConfig.provider === 'mongo') {
      this.mongo = createConnection(cacheConfig.mongo.connectionString)
    }
    if (webhookConfig.publisher.provider === 'temporal') {
      this.temporal = await TemporalConnection.connect({ address: webhookConfig.publisher.temporal.addr })
    }
  }

  get healthIndicators(): HealthIndicatorFunction[] {
    const indicators: HealthIndicatorFunction[] = [() => this.storageHealth.isHealthy()]
    if (this.cacheConfig.provider === 'redis') {
      indicators.push(() =>
        this.redisIndicator.checkHealth('cache-storage-redis', { client: this.redis!, type: 'redis' }),
      )
    }

    if (this.cacheConfig.provider === 'mongo') {
      indicators.push(() =>
        this.mongooseIndicator.pingCheck('cache-storage-mongo', {
          connection: this.mongo,
        }),
      )
    }

    if (this.webhookConfig.publisher.provider === 'temporal') {
      indicators.push(() => this.temporal!.healthService.check({}).then(() => ({ temporal: { status: 'up' } })))
    }

    return indicators
  }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check(this.healthIndicators)
  }
}
