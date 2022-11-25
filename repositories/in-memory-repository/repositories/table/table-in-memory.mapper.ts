import { Table } from '@egodb/core'
import { Result } from 'oxide.ts'
import type { TableInMemory } from './table'

export class TableInMemoryMapper {
  static toDomain(t: TableInMemory): Result<Table, Error> {
    return Result.safe(Table.create, t.name)
  }
}
