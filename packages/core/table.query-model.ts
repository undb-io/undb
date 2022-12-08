import type { Option } from 'oxide.ts'
import type { ITableSpec } from './specifications'
import type { IQueryTable } from './table'

export interface ITableQueryModel {
  findOne(spec: ITableSpec): Promise<Option<IQueryTable>>
  findOneById(id: string): Promise<Option<IQueryTable>>
  find(): Promise<IQueryTable[]>
}
