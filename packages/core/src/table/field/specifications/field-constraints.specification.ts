import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { IFieldType } from '../field.type.js'

export class WithFieldRequirement extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly type: IFieldType, public readonly fieldId: string, public readonly required: boolean) {
    super()
  }
  isSatisfiedBy(t: Table): boolean {
    const field = t.schema.getFieldById(this.fieldId).unwrap()
    return field.required === this.required
  }
  mutate(t: Table): Result<Table, string> {
    const field = t.schema.getFieldById(this.fieldId).unwrap()
    field.required = this.required
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withFieldRequirement(this)
    return Ok(undefined)
  }
}
