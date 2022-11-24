import { Table } from '@egodb/core/dist'
import { Result } from 'oxide.ts'
import { TableInMemory } from './table'

export class TableInMemoryMapper {
  static toDomain(t: TableInMemory): Result<Table, Error> {
    return Result.safe(Table.create, t.name)
  }
}
