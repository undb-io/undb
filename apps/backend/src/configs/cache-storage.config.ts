import { Inject } from '@nestjs/common'
import { registerAs } from '@nestjs/config'

export const InjectCacheStorageConfig = () => Inject(cacheStorageConfig.KEY)

const DEFAULT_CACHE_NAME = 'undb_cache'

export const cacheStorageConfig = registerAs('cache-storage', () => ({
  provider: (process.env.UNDB_CACHE_STORAGE_PROVIDER ?? 'memory') as 'memory' | 'fs' | 'redis' | 'mongo',
  redis: {
    host: process.env.UNDB_CACHE_STORAGE_REDIS_HOST,
    port: parseInt(process.env.UNDB_CACHE_STORAGE_REDIS_PORT ?? '6379', 10),
    password: process.env.UNDB_CACHE_STORAGE_REDIS_PASSWORD,
    ttl: process.env.UNDB_CACHE_STORAGE_REDIS_TTL ? parseInt(process.env.UNDB_CACHE_STORAGE_REDIS_TTL, 10) : undefined,
    base: process.env.UNDB_CACHE_STORAGE_REDIS_BASE || DEFAULT_CACHE_NAME,
  },
  mongo: {
    connectionString: process.env.UNDB_CACHE_STORAGE_MONGO_CONNECTION_STRING!,
    databaseName: process.env.UNDB_CACHE_STORAGE_MONGO_DATABASE_NAME || DEFAULT_CACHE_NAME,
    collectionName: process.env.UNDB_CACHE_STORAGE_MONGO_COLLECTION_NAME || DEFAULT_CACHE_NAME,
  },
}))
