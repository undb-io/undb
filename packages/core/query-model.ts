import type { Option } from 'oxide.ts'
import type { QueryTable } from './query-table'
import type { ITableSpec } from './specifications'

export interface ITableQueryModel {
  findOne(spec: ITableSpec): Promise<Option<QueryTable>>
  findOneById(id: string): Promise<Option<QueryTable>>
  find(): Promise<QueryTable[]>
}
