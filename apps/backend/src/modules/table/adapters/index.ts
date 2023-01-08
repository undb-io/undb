import type { Provider } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { NestRecordInMemoryQueryModel } from './in-memory/record-in-memory.query-model'
import { NestRecordInMemoryRepository } from './in-memory/record-in-memory.repository'
import { NestTableInMemoryQueryModel } from './in-memory/table-in-memory.query-model'
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
    useClass: NestTableInMemoryQueryModel,
  },
  {
    provide: RECORD_REPOSITORY,
    useClass: NestRecordInMemoryRepository,
  },
  {
    provide: RECORD_QUERY_MODEL,
    useClass: NestRecordInMemoryQueryModel,
  },
]
