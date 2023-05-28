/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import { TableSchema } from '../../value-objects/index.js'
import type { Field, NoneSystemField } from '../field.type.js'
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

export class WithDuplicatedField extends BaseFieldSpecification<Field> {
  constructor(field: Field, public readonly from: Field, public readonly includesValues: boolean = false) {
    super(field)
  }
  isSatisfiedBy(t: Table): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: Table): Result<Table, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withDuplicatedField(this)
    return Ok(undefined)
  }
}
