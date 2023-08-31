import { TableId } from '@undb/core'
import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { FLS } from '../fls.js'
import type { IFLSVisitor } from '../interface.js'

export class WithFLSTableId extends CompositeSpecification<FLS, IFLSVisitor> {
  constructor(public readonly tableId: TableId) {
    super()
  }
  static fromString(tableId: string): WithFLSTableId {
    return new this(TableId.from(tableId).unwrap())
  }
  isSatisfiedBy(t: FLS): boolean {
    return t.tableId.equals(this.tableId)
  }
  mutate(t: FLS): Result<FLS, string> {
    t.tableId = this.tableId
    return Ok(t)
  }
  accept(v: IFLSVisitor): Result<void, string> {
    v.withTableId(this)
    return Ok(undefined)
  }
}
