import { LowSync, MemorySync } from 'lowdb'
import type { TableInMemory } from './table'

type Data = {
  tables: TableInMemory[]
}

export const db = new LowSync(new MemorySync<Data>())

db.data ||= { tables: [] }
