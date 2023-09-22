import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import { BaseId } from '../../base/index.js'
import { type Table } from '../table.js'
import type { ITableSpecVisitor } from './interface.js'

export class WithTableBaseId extends CompositeSpecification {
  constructor(public readonly id: BaseId) {
    super()
  }

  static fromString(id: string): WithTableBaseId {
    return new WithTableBaseId(BaseId.from(id))
  }

  isSatisfiedBy(t: Table): boolean {
    return this.id.equals(t.baseId)
  }

  mutate(t: Table): Result<Table, string> {
    t.baseId = this.id
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.baseIdEq(this)
    return Ok(undefined)
  }
}
