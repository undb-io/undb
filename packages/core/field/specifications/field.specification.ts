import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications'
import type { Table } from '../../table'
import { TableSchema } from '../../value-objects'
import type { NoneSystemField } from '../field.type'
import { BaseFieldSpecification } from './base-field.specification'

export class WithoutField extends BaseFieldSpecification<NoneSystemField> {
  isSatisfiedBy(t: Table): boolean {
    return t.schema.getFieldById(this.field.id.value).mapOr(false, (f) => f.key.equals(this.field.key))
  }

  mutate(t: Table): Result<Table, string> {
    t.schema = new TableSchema(t.schema.fields.filter((f) => !f.key.equals(this.field.key)))
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withoutField(this)
    return Ok(undefined)
  }
}
