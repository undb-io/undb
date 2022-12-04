import { CompositeSpecification } from '@egodb/domain/dist'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { TableId as tableId } from '../../value-objects'
import type { Record } from '../record'
import type { IRecordSpecVisitor } from './interface'

export class WithRecordTableId extends CompositeSpecification {
  constructor(public readonly id: tableId) {
    super()
  }

  isSatisfiedBy(t: Record): boolean {
    return this.id.equals(t.tableId)
  }

  mutate(t: Record): Result<Record, string> {
    t.tableId = this.id
    return Ok(t)
  }

  accept(v: IRecordSpecVisitor): Result<void, string> {
    v.tableIdEqual(this)
    return Ok(undefined)
  }
}

export const WithRecordTableIdS = (id: string) => tableId.from(id).map((tableId) => new WithRecordTableId(tableId))
