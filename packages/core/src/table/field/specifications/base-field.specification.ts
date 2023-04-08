import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { BaseField } from '../field.base.js'
import type { Field } from '../field.type.js'
import { FieldDescription } from '../value-objects/field-description.js'
import { FieldName } from '../value-objects/field-name.vo.js'

export abstract class BaseFieldSpecification<F extends Field> extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly field: F) {
    super()
  }
}

export class WithFieldName extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly field: BaseField, public readonly name: FieldName) {
    super()
  }

  static fromString(field: BaseField, name: string) {
    return new this(field, FieldName.create(name))
  }

  isSatisfiedBy(t: Table): boolean {
    return this.field.name.equals(this.name)
  }

  mutate(t: Table): Result<Table, string> {
    this.field.name = this.name
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withFieldName(this)
    return Ok(undefined)
  }
}

export class WithFieldDescription extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly field: BaseField, public readonly description: FieldDescription) {
    super()
  }

  static fromString(field: BaseField, description: string) {
    return new this(field, new FieldDescription({ value: description }))
  }

  isSatisfiedBy(t: Table): boolean {
    return !!this.field.description?.equals(this.description)
  }

  mutate(t: Table): Result<Table, string> {
    this.field.description = this.description
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withFieldDescription(this)
    return Ok(undefined)
  }
}
export class WithFieldDisplay extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly field: BaseField, public readonly display: boolean) {
    super()
  }

  isSatisfiedBy(t: Table): boolean {
    return !!this.field.display === this.display
  }

  mutate(t: Table): Result<Table, string> {
    this.field.display = this.display
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withFieldDisplay(this)
    return Ok(undefined)
  }
}
