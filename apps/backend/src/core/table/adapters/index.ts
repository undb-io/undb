import { Inject, Provider } from '@nestjs/common'
import { PinoLogger } from 'nestjs-pino'
import { cacheStorageConfig } from '../../../configs/cache-storage.config.js'
import { CSVExportor } from '../exportor/csv.exportor.js'
import { ExcelExportor } from '../exportor/excel.exportor.js'
import { cacheStorageFactory } from './cache-storage.factory.js'
import { NestAggregateSqliteQueryModel } from './sqlite/record-sqlite.aggregate-repository.js'
import { NestRecordSqliteQueryModel } from './sqlite/record-sqlite.query-model.js'
import { NestRecordSqliteRepository } from './sqlite/record-sqlite.repository.js'
import { NestRecordSqliteTreeQueryModel, RECORD_TREE_QUERY_MODEL } from './sqlite/record-sqlite.tree-query-model.js'
import { NestSqliteUnitOfWork, UNIT_OF_WORK } from './sqlite/sqlite.uow.js'
import { NestTableKVCache, STORAGE } from './sqlite/table-kv.cache.js'
import { NestTableSqliteQueryModel } from './sqlite/table-sqlite.query-model.js'
import { NestTableSqliteRepository, TABLE_KV_CACHE } from './sqlite/table-sqlite.repository.js'

export const TABLE_REPOSITORY = Symbol('TABLE_REPOSITORY')
export const InjectTableRepository = () => Inject(TABLE_REPOSITORY)

const TABLE_QUERY_MODEL = Symbol('TABLE_QUERY_MODEL')
export const InjectTableQueryModel = () => Inject(TABLE_QUERY_MODEL)

const RECORD_AGGREGATE_REPOSITORY = Symbol('RECORD_AGGREGATE_REPOSITORY')
export const InjectRecordAggregateRepositoy = () => Inject(RECORD_AGGREGATE_REPOSITORY)

const RECORD_REPOSITORY = Symbol('RECORD_REPOSITORY')
export const InjectRecordRepository = () => Inject(RECORD_REPOSITORY)

const RECORD_QUERY_MODEL = Symbol('RECORD_QUERY_MODEL')
export const InjectRecordQueryModel = () => Inject(RECORD_QUERY_MODEL)

const RECORD_CSV_EXPORTOR = Symbol('RECORD_CSV_EXPORTOR')
export const InjectRecordCSVExportor = () => Inject(RECORD_CSV_EXPORTOR)

const RECORD_EXCEL_EXPORTOR = Symbol('RECORD_EXCEL_EXPORTOR')
export const InjectRecordExcelExportor = () => Inject(RECORD_EXCEL_EXPORTOR)

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
    provide: RECORD_CSV_EXPORTOR,
    useClass: CSVExportor,
  },
  {
    provide: RECORD_EXCEL_EXPORTOR,
    useClass: ExcelExportor,
  },
  {
    provide: TABLE_KV_CACHE,
    useClass: NestTableKVCache,
  },
  {
    provide: STORAGE,
    useFactory: cacheStorageFactory,
    inject: [PinoLogger, cacheStorageConfig.KEY],
  },
  {
    provide: UNIT_OF_WORK,
    useClass: NestSqliteUnitOfWork,
  },
]
