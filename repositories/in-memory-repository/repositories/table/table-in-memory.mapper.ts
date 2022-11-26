import type { Table } from '@egodb/core'
import type { Result } from 'oxide.ts'
import type { TableInMemory } from './table'

export class TableInMemoryMapper {
  static toDomain(t: TableInMemory): Result<Table, Error> {
    throw new Error('unimplemented')
  }
}
