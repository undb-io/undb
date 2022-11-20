import { TableRepository } from '@egodb/core'
import { Inject, Provider } from '@nestjs/common'
import { TableInmMemoryRepository } from './table-in-memory.repository'

export const InjectTableReposiory = () => Inject(TableRepository)

export const dbAdapters: Provider[] = [
  {
    provide: TableRepository,
    useClass: TableInmMemoryRepository,
  },
]
