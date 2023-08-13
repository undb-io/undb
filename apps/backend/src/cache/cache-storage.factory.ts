/* eslint-disable @typescript-eslint/ban-ts-comment */
import { type ConfigType } from '@nestjs/config'
import { type PinoLogger } from 'nestjs-pino'
import path from 'path'
import { match } from 'ts-pattern'
import type { Driver, Storage } from 'unstorage'
import { createStorage } from 'unstorage'
import type { cacheStorageConfig } from '../configs/cache-storage.config.js'

export const cacheStorageFactory = async (
  logger: PinoLogger,
  config: ConfigType<typeof cacheStorageConfig>,
): Promise<Storage> => {
  const driver: Driver = await match(config)
    .with({ provider: 'memory' }, async () => {
      const lruCacheDriver = await import('unstorage/drivers/lru-cache').then((m) => m.default)
      // @ts-ignore
      return lruCacheDriver()
    })
    .with({ provider: 'fs' }, async () => {
      const fsDriver = await import('unstorage/drivers/fs').then((m) => m.default)
      const base = path.resolve(process.cwd(), '../../.undb/cache')
      // @ts-ignore
      return fsDriver({ base })
    })
    .with({ provider: 'redis' }, async () => {
      const redisDriver = await import('unstorage/drivers/redis').then((m) => m.default)
      // @ts-ignore
      return redisDriver({
        host: config.redis.host,
        password: config.redis.password,
        tls: false as any,
        port: config.redis.port,
        base: config.redis.base,
        ttl: config.redis.ttl,
        connectTimeout: 10000,
      })
    })
    .with({ provider: 'mongo' }, async () => {
      const mongodbDriver = await import('unstorage/drivers/mongodb').then((m) => m.default)
      // @ts-ignore
      return mongodbDriver({
        connectionString: config.mongo.connectionString,
        databaseName: config.mongo.databaseName,
        collectionName: config.mongo.collectionName,
      })
    })
    .exhaustive()

  const storage = createStorage({
    driver,
  })

  logger.info('Initialized cache storage %s', driver?.name)

  return storage
}
