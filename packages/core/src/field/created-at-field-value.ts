import type { ICreatedAtFieldQueryValue, ICreatedAtFieldValue } from './created-at-field.type.js'
import { FieldValueBase } from './field-value.base.js'
import type { IFieldValueVisitor } from './field-value.visitor.js'

export class CreatedAtFieldValue extends FieldValueBase<ICreatedAtFieldValue> {
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
