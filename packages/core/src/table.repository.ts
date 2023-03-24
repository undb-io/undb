import type { IBaseRepository } from '@egodb/domain'
import type { Option } from 'oxide.ts'
import type { ITableSpec } from './specifications/interface.js'
import { type Table } from './table.js'

export interface ITableRepository extends IBaseRepository {
  findOneById(id: string): Promise<Option<Table>>
  findOne(spec: ITableSpec): Promise<Option<Table>>
  find(spec: ITableSpec): Promise<Table[]>

  insert(table: Table): Promise<void>
  updateOneById(id: string, spec: ITableSpec): Promise<void>
  deleteOneById(id: string): Promise<void>
}
