import { CompositeSpecification, DateVO } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Record } from '../record.js'
import type { IRecordVisitor } from './interface.js'

export class WithRecordUpdatedAt extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(public readonly date: DateVO) {
    super()
  }

  static fromDate(date: Date): WithRecordUpdatedAt {
    return new this(new DateVO(date))
  }

  static now(): WithRecordUpdatedAt {
    return this.fromDate(new Date())
  }

  static fromString(date: string): WithRecordUpdatedAt {
    return this.fromDate(new Date(date))
  }

  isSatisfiedBy(t: Record): boolean {
    return this.date.equals(t.updatedAt)
  }

  mutate(r: Record): Result<Record, string> {
    r.updatedAt = this.date
    return Ok(r)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.createdAt(this)
    return Ok(undefined)
  }
}
