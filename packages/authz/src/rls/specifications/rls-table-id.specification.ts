import { TableId } from '@undb/core'
import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { IRLSVisitor } from '../interface.js'
import type { RLS } from '../rls.js'

export class WithRLSTableId extends CompositeSpecification<RLS, IRLSVisitor> {
  constructor(public readonly tableId: TableId) {
    super()
  }
  static fromString(tableId: string): WithRLSTableId {
    return new this(TableId.from(tableId).unwrap())
  }
  isSatisfiedBy(t: RLS): boolean {
    return t.tableId.equals(this.tableId)
  }
  mutate(t: RLS): Result<RLS, string> {
    t.tableId = this.tableId
    return Ok(t)
  }
  accept(v: IRLSVisitor): Result<void, string> {
    v.withTableId(this)
    return Ok(undefined)
  }
}
