import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { TableId as tableId } from '../../value-objects/index.js'
import type { Record } from '../record.js'
import type { IRecordVisitor } from './interface.js'

export class WithRecordTableId extends CompositeSpecification {
  constructor(public readonly id: tableId) {
    super()
  }

  static fromString(id: string): Result<WithRecordTableId, Error> {
    return tableId.from(id).map((tableId) => new WithRecordTableId(tableId))
  }

  isSatisfiedBy(t: Record): boolean {
    return this.id.equals(t.tableId)
  }

  mutate(t: Record): Result<Record, string> {
    t.tableId = this.id
    return Ok(t)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.tableIdEqual(this)
    return Ok(undefined)
  }
}
