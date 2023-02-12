import { FieldValueBase } from './field-value.base.js'
import type { IFieldValueVisitor } from './field-value.visitor.js'
import type { IUpdatedAtFieldValue } from './updated-at-field.type.js'

export class UpdatedAtFieldValue extends FieldValueBase<IUpdatedAtFieldValue> {
  constructor(value: IUpdatedAtFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.updatedAt(this)
  }
}
