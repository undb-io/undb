import { CompositeSpecification, DateVO } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Audit } from '../audit'
import type { IAuditSpecVisitor } from './interface'

export class WithAuditTimestamp extends CompositeSpecification<Audit, IAuditSpecVisitor> {
  constructor(public readonly timestamp: DateVO) {
    super()
  }
  static fromDate(date: Date): WithAuditTimestamp {
    return new this(new DateVO(date))
  }
  static now(): WithAuditTimestamp {
    return new this(new DateVO(new Date()))
  }
  isSatisfiedBy(t: Audit): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: Audit): Result<Audit, string> {
    t.timestamp = this.timestamp
    return Ok(t)
  }
  accept(v: IAuditSpecVisitor): Result<void, string> {
    v.timestampEqual(this)
    return Ok(undefined)
  }
}

export class WithAuditAfter extends CompositeSpecification<Audit, IAuditSpecVisitor> {
  constructor(public readonly timestamp: DateVO) {
    super()
  }
  static fromDate(date: Date): WithAuditTimestamp {
    return new this(new DateVO(date))
  }
  isSatisfiedBy(t: Audit): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: Audit): Result<Audit, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: IAuditSpecVisitor): Result<void, string> {
    v.after(this)
    return Ok(undefined)
  }
}
