import type { JsonValue } from 'type-fest'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { ICreatedByFieldQueryValue, ICreatedByFieldValue } from './created-by-field.type.js'

export class CreatedByFieldValue extends FieldValueBase<ICreatedByFieldValue> {
  get json(): JsonValue {
    return this.props.value
  }
  constructor(value: ICreatedByFieldValue) {
    super({ value })
  }

  static fromQuery(str: ICreatedByFieldQueryValue): CreatedByFieldValue {
    return new this(str)
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.createdBy(this)
  }
}
