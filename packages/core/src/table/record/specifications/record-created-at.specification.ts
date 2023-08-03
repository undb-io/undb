import { CompositeSpecification, DateVO } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Record } from '../record.js'
import type { IRecordVisitor } from './interface.js'

export class WithRecordCreatedAt extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(public readonly date: DateVO) {
    super()
  }

  static fromDate(date: Date): WithRecordCreatedAt {
    return new this(new DateVO(date))
  }

  static now(): WithRecordCreatedAt {
    return this.fromDate(new Date())
  }

  static fromString(date: string): WithRecordCreatedAt {
    return this.fromDate(new Date(date))
  }

  isSatisfiedBy(t: Record): boolean {
    return this.date.equals(t.createdAt)
  }

  mutate(r: Record): Result<Record, string> {
    r.createdAt = this.date
    return Ok(r)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.createdAt(this)
    return Ok(undefined)
  }
}
