import type { IRecordRepository, IRecordSpec, Record } from '@egodb/core'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { db } from '../db.js'
import { RecordInMemoryMapper } from './record-in-memory.mapper.js'

export class RecordInMemoryRepository implements IRecordRepository {
  async findOneById(id: string): Promise<Option<Record>> {
    const r = db.data?.records.find((t) => t.id === id)
    if (!r) return None

    const record = RecordInMemoryMapper.toDomain(r).unwrap()
    return Some(record)
  }

  async findOne(spec: IRecordSpec): Promise<Option<Record>> {
    throw new Error('unimplemented')
  }

  async find(spec: IRecordSpec): Promise<Record[]> {
    throw new Error('unimplemented')
  }

  async insert(record: Record): Promise<void> {
    db.data?.records.push(RecordInMemoryMapper.toInMemory(record))
  }

  async updateOneById(id: string, spec: IRecordSpec): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
