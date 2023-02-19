import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { BaseField } from '../field.base.js'
import type { Field } from '../field.type.js'
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
