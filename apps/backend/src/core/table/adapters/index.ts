import { Inject, Provider } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { PinoLogger } from 'nestjs-pino'
import path from 'path'
import { Driver, createStorage } from 'unstorage'
import { cacheStorageConfig } from '../../../configs/cache-storage.config.js'
import { NestAggregateSqliteQueryModel } from './sqlite/record-sqlite.aggregate-repository.js'
import { NestRecordSqliteQueryModel } from './sqlite/record-sqlite.query-model.js'
import { NestRecordSqliteRepository } from './sqlite/record-sqlite.repository.js'
import { NestRecordSqliteTreeQueryModel, RECORD_TREE_QUERY_MODEL } from './sqlite/record-sqlite.tree-query-model.js'
import { NestTableKVCache, STORAGE } from './sqlite/table-kv.cache.js'
import { NestTableSqliteQueryModel } from './sqlite/table-sqlite.query-model.js'
import { NestTableSqliteRepository, TABLE_KV_CACHE } from './sqlite/table-sqlite.repository.js'
import { CSVExportor } from '../exportor/csv.exportor.js'
import { ExcelExportor } from '../exportor/excel.exportor.js'

export const TABLE_REPOSITORY = Symbol('TABLE_REPOSITORY')
export const InjectTableReposiory = () => Inject(TABLE_REPOSITORY)

const TABLE_QUERY_MODEL = Symbol('TABLE_QUERY_MODEL')
export const InjectTableQueryModel = () => Inject(TABLE_QUERY_MODEL)

const RECORD_AGGREGATE_REPOSITORY = Symbol('RECORD_AGGREGATE_REPOSITORY')
export const InjectRecordAggregateRepositoy = () => Inject(RECORD_AGGREGATE_REPOSITORY)

const RECORD_REPOSITORY = Symbol('RECORD_REPOSITORY')
export const InjectRecordReposiory = () => Inject(RECORD_REPOSITORY)

const RECORD_QUERY_MODEL = Symbol('RECORD_QUERY_MODEL')
export const InjectRecordQueryModel = () => Inject(RECORD_QUERY_MODEL)

const RECORD_EXPORTOR = Symbol('RECORD_EXPORTOR')
export const InjectRecordExportor = () => Inject(RECORD_EXPORTOR)

export const dbAdapters: Provider[] = [
  {
    provide: TABLE_REPOSITORY,
    useClass: NestTableSqliteRepository,
  },
  {
    provide: TABLE_QUERY_MODEL,
    useClass: NestTableSqliteQueryModel,
  },
  {
    provide: RECORD_REPOSITORY,
    useClass: NestRecordSqliteRepository,
  },
  {
    provide: RECORD_QUERY_MODEL,
    useClass: NestRecordSqliteQueryModel,
  },
  {
    provide: RECORD_TREE_QUERY_MODEL,
    useClass: NestRecordSqliteTreeQueryModel,
  },
  {
    provide: RECORD_AGGREGATE_REPOSITORY,
    useClass: NestAggregateSqliteQueryModel,
  },
  {
    provide: RECORD_EXPORTOR,
    useClass: CSVExportor,
  },
  {
    provide: RECORD_EXPORTOR,
    useClass: ExcelExportor,
  },
  {
    provide: TABLE_KV_CACHE,
    useClass: NestTableKVCache,
  },
  {
    provide: STORAGE,
    useFactory: async (logger: PinoLogger, config: ConfigType<typeof cacheStorageConfig>) => {
      let driver: Driver | undefined
      if (config.provider === 'memory') {
        const lruCacheDriver = await import('unstorage/drivers/lru-cache').then((m) => m.default)
        driver = lruCacheDriver()
      } else if (config.provider === 'redis') {
        const redisDriver = await import('unstorage/drivers/redis').then((m) => m.default)
        driver = redisDriver({
          host: config.redis.host,
          password: config.redis.password,
          tls: false as any,
          port: config.redis.port,
          base: config.redis.base,
          ttl: config.redis.ttl,
          connectTimeout: 10000,
        })
      } else if (config.provider === 'fs') {
        const fsDriver = await import('unstorage/drivers/fs').then((m) => m.default)
        const base = path.resolve(process.cwd(), '../../.undb/cache')
        driver = fsDriver({ base })
      } else if (config.provider === 'mongo') {
        const mongodbDriver = await import('unstorage/drivers/mongodb').then((m) => m.default)
        driver = mongodbDriver({
          connectionString: config.mongo.connectionString,
          databaseName: config.mongo.databaseName,
          collectionName: config.mongo.collectionName,
        })
      }

      const storage = createStorage({
        driver,
      })

      logger.info('initialized cache storage %s', driver?.name)

      return storage
    },
    inject: [PinoLogger, cacheStorageConfig.KEY],
  },
]
