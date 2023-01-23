import { FieldValueBase } from './field-value.base'
import type { IFieldValueVisitor } from './field-value.visitor'
import type { IUpdatedAtFieldValue } from './updated-at-field.type'

export class UpdatedAtFieldValue extends FieldValueBase<IUpdatedAtFieldValue> {
  constructor(value: IUpdatedAtFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.updatedAt(this)
  }
}
