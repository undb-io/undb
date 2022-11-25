import type { Option } from 'oxide.ts'
import type { ITableSpec } from './specifications/interface'
import { type Table } from './table'

export interface ITableRepository {
  findOneById(id: string): Promise<Option<Table>>
  findOne(spec: ITableSpec): Promise<Option<Table>>
  find(spec: ITableSpec): Promise<Table[]>

  insert(table: Table): Promise<void>
}
