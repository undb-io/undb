import { CompositeSpecification, DateVO } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Record } from '../record'
import type { IRecordVisitor } from './interface'

export class WithRecordCreatedAt extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(public readonly date: DateVO) {
    super()
  }

  static fromDate(date: Date): WithRecordCreatedAt {
    return new this(new DateVO(date))
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
