import type { Provider } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { NestRecordSqliteQueryModel } from './sqlite/record-sqlite.query-model'
import { NestRecordSqliteRepository } from './sqlite/record-sqlite.repository'
import { NestTableSqliteManager, UNDELYING_TABLE_MANAGER } from './sqlite/table-sqlite.manager'
import { NestTableSqliteQueryModel } from './sqlite/table-sqlite.query-model'
import { NestTableSqliteRepository } from './sqlite/table-sqlite.repository'

const TABLE_REPOSITORY = Symbol('TABLE_REPOSITORY')
export const InjectTableReposiory = () => Inject(TABLE_REPOSITORY)

const TABLE_QUERY_MODEL = Symbol('TABLE_QUERY_MODEL')
export const InjectTableQueryModel = () => Inject(TABLE_QUERY_MODEL)

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
    provide: UNDELYING_TABLE_MANAGER,
    useClass: NestTableSqliteManager,
  },
]
