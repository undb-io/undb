import type { Option } from 'oxide.ts'

import type { Table } from '../table.js'
import type { Record } from './record.js'
import type { IRecordSpec } from './specifications/interface.js'

export interface IRecordRepository {
  deleteManyByIds(table: Table, ids: string[]): Promise<void>
  deleteOneById(table: Table, id: string): Promise<void>

  find(table: Table, spec: IRecordSpec | null): Promise<Record[]>
  findDeletedOneById(table: Table, id: string): Promise<Option<Record>>
  findOne(table: Table, spec: IRecordSpec | null): Promise<Option<Record>>
  findOneById(table: Table, id: string): Promise<Option<Record>>

  insert(table: Table, record: Record): Promise<void>
  insertMany(table: Table, records: Record[]): Promise<void>

  restoreOneById(table: Table, id: string): Promise<void>
  updateManyByIds(table: Table, updates: { id: string; spec: IRecordSpec }[]): Promise<void>

  updateOneById(table: Table, id: string, spec: IRecordSpec): Promise<void>
}
