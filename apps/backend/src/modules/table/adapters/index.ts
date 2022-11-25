import type { Provider } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { NestTableInMemoryQueryModel } from './table-in-memory.query-model'
import { NestTableInMemoryRepository } from './table-in-memory.repository'

const TABLE_REPOSITORY = Symbol('TABLE_REPOSITORY')
export const InjectTableReposiory = () => Inject(TABLE_REPOSITORY)

const TABLE_QUERY_MODEL = Symbol('TABLE_QUERY_MODEL')
export const InjectTableQueryModel = () => Inject(TABLE_QUERY_MODEL)

export const dbAdapters: Provider[] = [
  {
    provide: TABLE_REPOSITORY,
    useClass: NestTableInMemoryRepository,
  },
  {
    provide: TABLE_QUERY_MODEL,
    useClass: NestTableInMemoryQueryModel,
  },
]
