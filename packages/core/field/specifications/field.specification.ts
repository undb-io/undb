import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import { TableSchema } from '../../value-objects/index.js'
import type { NoneSystemField } from '../field.type.js'
import { BaseFieldSpecification } from './base-field.specification.js'

export class WithoutField extends BaseFieldSpecification<NoneSystemField> {
  isSatisfiedBy(t: Table): boolean {
    return t.schema.getFieldById(this.field.id.value).mapOr(false, (f) => f.id.equals(this.field.id))
  }

  mutate(t: Table): Result<Table, string> {
    t.schema = new TableSchema(t.schema.fields.filter((f) => !f.id.equals(this.field.id)))
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withoutField(this)
    return Ok(undefined)
  }
}
