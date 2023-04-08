import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Field } from '../field/index.js'
import type { Table } from '../table.js'
import type { ITableSpecVisitor } from './interface.js'

export class WithNewField extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly field: Field) {
    super()
  }

  isSatisfiedBy(): boolean {
    return false
  }

  mutate(t: Table): Result<Table, string> {
    t.schema.addField(this.field)
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.newField(this)
    return Ok(undefined)
  }
}
