import { LowSync, MemorySync } from 'lowdb'
import type { RecordInMemory } from './record/record.type'
import type { TableInMemory } from './table/table'

type Data = {
  tables: TableInMemory[]
  records: RecordInMemory[]
}

export const db = new LowSync(new MemorySync<Data>())

db.data ||= { tables: [], records: [] }
