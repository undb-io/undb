import { Inject, Provider } from '@nestjs/common'
import { NestTableInMemoryRepository } from './table-in-memory.repository'

const TABLE_REPOSITORY = Symbol('TABLE_REPOSITORY')

export const InjectTableReposiory = () => Inject(TABLE_REPOSITORY)

export const dbAdapters: Provider[] = [
  {
    provide: TABLE_REPOSITORY,
    useClass: NestTableInMemoryRepository,
  },
]
