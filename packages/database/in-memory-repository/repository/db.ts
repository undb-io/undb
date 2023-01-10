import { LowSync, MemorySync } from 'lowdb'
import type { RecordInMemory } from './record/record.type'

type Data = {
  records: RecordInMemory[]
}

export const db = new LowSync(new MemorySync<Data>())

db.data ||= { records: [] }
