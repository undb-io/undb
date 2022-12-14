import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Record } from '../record'
import { RecordId } from '../value-objects'
import type { IRecordVisitor } from './interface'

export class WithRecordId extends CompositeSpecification {
  constructor(public readonly id: RecordId) {
    super()
  }

  static fromString(id: string): WithRecordId {
    return new WithRecordId(RecordId.from(id))
  }

  isSatisfiedBy(t: Record): boolean {
    return this.id.equals(t.id)
  }

  mutate(t: Record): Result<Record, string> {
    t.id = this.id
    return Ok(t)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.idEqual(this)
    return Ok(undefined)
  }
}
