import type { IRecordRepository, IRecordSpec, Record, TableSchemaMap } from '@egodb/core'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { db } from '../db.js'
import { RecordInMemoryMapper } from './record-in-memory.mapper.js'
import { RecordInMemoryMutationVisitor } from './record-in-memory.mutation-visitor.js'

export class RecordInMemoryRepository implements IRecordRepository {
  async findOneById(id: string, schema: TableSchemaMap): Promise<Option<Record>> {
    const r = db.data?.records.find((t) => t.id === id)
    if (!r) return None

    const record = RecordInMemoryMapper.toDomain(r, schema).unwrap()
    return Some(record)
  }

  async insert(record: Record): Promise<void> {
    db.data?.records.push(RecordInMemoryMapper.toInMemory(record))
  }

  async updateOneById(id: string, spec: IRecordSpec): Promise<void> {
    const record = db.data?.records.find((r) => r.id === id)
    if (!record) return

    const visitor = new RecordInMemoryMutationVisitor(record)
    spec.accept(visitor)
  }
}
