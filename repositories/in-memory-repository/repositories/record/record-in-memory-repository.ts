import type { IRecordRepository, IRecordSpec, Record } from '@egodb/core'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { db } from '../db.js'
import { RecordInMemoryMapper } from './record-in-memory.mapper.js'
import { RecordInMemoryQueryVisitor } from './record-in-memory.query-visitor.js'

export class RecordInMemoryRepository implements IRecordRepository {
  async findOneById(id: string): Promise<Option<Record>> {
    const t = db.data?.records.find((t) => t.id === id)
    if (!t) return None

    const table = RecordInMemoryMapper.toDomain(t).unwrap()
    return Some(table)
  }

  async findOne(spec: IRecordSpec): Promise<Option<Record>> {
    const visitor = new RecordInMemoryQueryVisitor()
    spec.accept(visitor)

    const predicate = visitor.getPredicate().unwrap()

    const t = db.data?.records.find(predicate)
    return t ? Some(RecordInMemoryMapper.toDomain(t).unwrap()) : None
  }

  async find(spec: IRecordSpec): Promise<Record[]> {
    const visitor = new RecordInMemoryQueryVisitor()
    spec.accept(visitor)

    const predicate = visitor.getPredicate().unwrap()

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return db
      .data!.records.filter(predicate)
      .map(RecordInMemoryMapper.toDomain)
      .map((t) => t.unwrap())
  }

  async insert(table: Record): Promise<void> {
    db.data?.records.push(RecordInMemoryMapper.toInMemory(table))
  }
}
