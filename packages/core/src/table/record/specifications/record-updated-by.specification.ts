import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Record } from '../record.js'
import type { IRecordVisitor } from './interface.js'

export class WithRecordUpdatedBy extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(public readonly user: string) {
    super()
  }

  static fromString(user: string): WithRecordUpdatedBy {
    return new this(user)
  }

  isSatisfiedBy(t: Record): boolean {
    return this.user === t.updatedBy
  }

  mutate(r: Record): Result<Record, string> {
    r.updatedBy = this.user
    return Ok(r)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.updatedBy(this)
    return Ok(undefined)
  }
}
