import type { JsonValue } from 'type-fest'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { ICreatedAtFieldQueryValue, ICreatedAtFieldValue } from './created-at-field.type.js'

export class CreatedAtFieldValue extends FieldValueBase<ICreatedAtFieldValue> {
  get json(): JsonValue {
    return this.props.value.toISOString()
  }
  constructor(value: ICreatedAtFieldValue) {
    super({ value })
  }

  static fromQuery(str: ICreatedAtFieldQueryValue): CreatedAtFieldValue {
    return new this(new Date(str))
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.createdAt(this)
  }
}
