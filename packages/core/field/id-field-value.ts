import { FieldValueBase } from './field-value.base'
import type { IFieldValueVisitor } from './field-value.visitor'
import type { IIdFieldValue } from './id-field.type'

export class IdFieldValue extends FieldValueBase<IIdFieldValue> {
  constructor(value: IIdFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.id(this)
  }
}
