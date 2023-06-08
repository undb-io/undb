import { Inject, Provider } from '@nestjs/common'
import { createStorage } from 'unstorage'
import lruCacheDriver from 'unstorage/drivers/lru-cache'
import { NestAggregateSqliteQueryModel } from './sqlite/record-sqlite.aggregate-repository.js'
import { NestRecordSqliteQueryModel } from './sqlite/record-sqlite.query-model.js'
import { NestRecordSqliteRepository } from './sqlite/record-sqlite.repository.js'
import { NestRecordSqliteTreeQueryModel, RECORD_TREE_QUERY_MODEL } from './sqlite/record-sqlite.tree-query-model.js'
import { NestTableKVCache, STORAGE } from './sqlite/table-kv.cache.js'
import { NestTableSqliteQueryModel } from './sqlite/table-sqlite.query-model.js'
import { NestTableSqliteRepository, TABLE_KV_CACHE } from './sqlite/table-sqlite.repository.js'

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
    provide: TABLE_KV_CACHE,
    useClass: NestTableKVCache,
  },
  {
    provide: STORAGE,
    useFactory: async () => {
      const storage = createStorage({
        driver: lruCacheDriver(),
      })

      return storage
    },
  },
]
