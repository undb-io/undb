import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Record } from '../record.js'
import type { IRecordVisitor } from './interface.js'

export class WithRecordCreatedBy extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(public readonly user: string) {
    super()
  }

  static fromString(user: string): WithRecordCreatedBy {
    return new this(user)
  }

  isSatisfiedBy(t: Record): boolean {
    return this.user === t.createdBy
  }

  mutate(r: Record): Result<Record, string> {
    r.createdBy = this.user
    return Ok(r)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.createdBy(this)
    return Ok(undefined)
  }
}
