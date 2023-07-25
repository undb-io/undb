import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Audit } from '../audit'
import type { IAuditSpecVisitor } from './interface'

export class WithAuditOperator extends CompositeSpecification<Audit, IAuditSpecVisitor> {
  constructor(public readonly operatorId: string) {
    super()
  }
  isSatisfiedBy(t: Audit): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: Audit): Result<Audit, string> {
    t.operatorId = this.operatorId
    return Ok(t)
  }
  accept(v: IAuditSpecVisitor): Result<void, string> {
    v.operatorEqual(this)
    return Ok(undefined)
  }
}
