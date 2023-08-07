import type { Option } from 'oxide.ts'
import type { Table } from '../table.js'
import type { Record } from './record.js'
import type { IRecordSpec } from './specifications/interface.js'

export interface IRecordRepository {
  insert(table: Table, record: Record): Promise<void>
  insertMany(table: Table, records: Record[]): Promise<void>

  findOneById(table: Table, id: string): Promise<Option<Record>>
  findDeletedOneById(table: Table, id: string): Promise<Option<Record>>
  findOne(table: Table, spec: IRecordSpec | null): Promise<Option<Record>>
  find(table: Table, spec: IRecordSpec): Promise<Record[]>

  updateOneById(table: Table, id: string, spec: IRecordSpec): Promise<void>
  updateManyByIds(table: Table, updates: { id: string; spec: IRecordSpec }[]): Promise<void>

  deleteOneById(table: Table, id: string): Promise<void>
  deleteManyByIds(table: Table, ids: string[]): Promise<void>

  restoreOneById(table: Table, id: string): Promise<void>
}
