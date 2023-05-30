import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { IFieldType } from '../field.type.js'
import { FieldDescription } from '../value-objects/field-description.js'
import { FieldName } from '../value-objects/field-name.vo.js'

export class WithFieldName extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly type: IFieldType, public readonly fieldId: string, public readonly name: FieldName) {
    super()
  }

  static fromString(type: IFieldType, fieldId: string, name: string) {
    return new this(type, fieldId, FieldName.create(name))
  }

  isSatisfiedBy(t: Table): boolean {
    const field = t.schema.getFieldById(this.fieldId).unwrap()
    return field.name.equals(this.name)
  }

  mutate(t: Table): Result<Table, string> {
    const field = t.schema.getFieldById(this.fieldId).unwrap()
    field.name = this.name
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withFieldName(this)
    return Ok(undefined)
  }
}

export class WithFieldDescription extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(
    public readonly type: IFieldType,
    public readonly fieldId: string,
    public readonly description: FieldDescription,
  ) {
    super()
  }

  static fromString(type: IFieldType, fieldId: string, description: string) {
    return new this(type, fieldId, new FieldDescription({ value: description }))
  }

  isSatisfiedBy(t: Table): boolean {
    const field = t.schema.getFieldById(this.fieldId).unwrap()
    return !!field.description?.equals(this.description)
  }

  mutate(t: Table): Result<Table, string> {
    const field = t.schema.getFieldById(this.fieldId).unwrap()
    field.description = this.description
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withFieldDescription(this)
    return Ok(undefined)
  }
}
export class WithFieldDisplay extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly type: IFieldType, public readonly fieldId: string, public readonly display: boolean) {
    super()
  }

  isSatisfiedBy(t: Table): boolean {
    const field = t.schema.getFieldById(this.fieldId).unwrap()
    return !!field.display === this.display
  }

  mutate(t: Table): Result<Table, string> {
    const field = t.schema.getFieldById(this.fieldId).unwrap()
    field.display = this.display
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withFieldDisplay(this)
    return Ok(undefined)
  }
}
