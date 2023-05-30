/* eslint-disable @typescript-eslint/no-unused-vars */
import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { BaseField } from '../field.base.js'
import type { Field, IFieldType } from '../field.type.js'

export class WithoutField extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly type: IFieldType, public readonly fieldId: string) {
    super()
  }
  isSatisfiedBy(t: Table): boolean {
    const field = t.schema.getFieldById(this.fieldId)
    return field.mapOr(false, (f) => f.id.value === this.fieldId)
  }

  mutate(t: Table): Result<Table, string> {
    // FIXME: 循环引用
    // t.schema = new TableSchema(t.schema.fields.filter((f) => f.id.value !== this.fieldId))
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withoutField(this)
    return Ok(undefined)
  }
}

export class WithDuplicatedField extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(
    public readonly field: Field,
    public readonly from: Field,
    public readonly includesValues: boolean = false,
  ) {
    super()
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

export class WithNewFieldType extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(
    public readonly field: BaseField,
    public readonly newType: IFieldType,
    public readonly includesValues: boolean = false,
  ) {
    super()
  }

  isSatisfiedBy(t: Table): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: Table): Result<Table, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withNewFieldType(this)
    return Ok(undefined)
  }
}
