import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Audit } from '../audit'
import type { IAuditSpecVisitor } from './interface'

export class WithAuditTimestamp extends CompositeSpecification<Audit, IAuditSpecVisitor> {
  isSatisfiedBy(t: Audit): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: Audit): Result<Audit, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: IAuditSpecVisitor): Result<void, string> {
    v.timestampEqual(this)
    return Ok(undefined)
  }
}
