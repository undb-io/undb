import { Inject } from '@nestjs/common'
import { registerAs } from '@nestjs/config'

export const InjectCacheStorageConfig = () => Inject(cacheStorageConfig.KEY)

export const cacheStorageConfig = registerAs('cache-storage', () => ({
  provider: (process.env.UNDB_CACHE_STORAGE_PROVIDER ?? 'memory') as 'memory' | 'fs' | 'redis',
  redis: {
    host: process.env.UNDB_CACHE_STORAGE_REDIS_HOST,
    port: parseInt(process.env.UNDB_CACHE_STORAGE_REDIS_PORT ?? '6379', 10),
    password: process.env.UNDB_CACHE_STORAGE_REDIS_PASSWORD,
    ttl: process.env.UNDB_CACHE_STORAGE_REDIS_TTL ? parseInt(process.env.UNDB_CACHE_STORAGE_REDIS_TTL, 10) : undefined,
    base: process.env.UNDB_CACHE_STORAGE_REDIS_BASE || 'undb_cache',
  },
}))
