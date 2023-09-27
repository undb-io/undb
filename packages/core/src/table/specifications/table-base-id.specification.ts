import { CompositeSpecification } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { None, Ok, Some, type Result } from 'oxide.ts'
import { BaseId } from '../../base/index.js'
import { type Table } from '../table.js'
import type { ITableSpecVisitor } from './interface.js'

export class WithTableBaseId extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly id: Option<BaseId>) {
    super()
  }

  static none(): WithTableBaseId {
    return new WithTableBaseId(None)
  }

  static fromString(id?: string): WithTableBaseId {
    return new WithTableBaseId(id ? Some(BaseId.from(id)) : None)
  }

  isSatisfiedBy(t: Table): boolean {
    throw new Error('Method not implemented.')
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
