import type { ICreatedByFieldQueryValue, ICreatedByFieldValue } from './created-by-field.type.js'
import { FieldValueBase } from './field-value.base.js'
import type { IFieldValueVisitor } from './field-value.visitor.js'

export class CreatedByFieldValue extends FieldValueBase<ICreatedByFieldValue> {
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
