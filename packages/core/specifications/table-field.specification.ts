import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '.'
import type { Field } from '../field'
import type { Table } from '../table'

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
