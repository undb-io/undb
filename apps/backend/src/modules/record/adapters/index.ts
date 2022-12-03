import type { Provider } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { NestRecordInMemoryRepository } from './record-in-memory.repository'

const TABLE_REPOSITORY = Symbol('TABLE_REPOSITORY')
export const InjectRecordReposiory = () => Inject(TABLE_REPOSITORY)

const TABLE_QUERY_MODEL = Symbol('TABLE_QUERY_MODEL')
export const InjectRecordQueryModel = () => Inject(TABLE_QUERY_MODEL)

export const dbAdapters: Provider[] = [
  {
    provide: TABLE_REPOSITORY,
    useClass: NestRecordInMemoryRepository,
  },
  // {
  //   provide: TABLE_QUERY_MODEL,
  //   useClass: NestRecordInMemoryQueryModel,
  // },
]
