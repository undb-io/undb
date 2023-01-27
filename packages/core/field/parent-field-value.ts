import { FieldValueBase } from './field-value.base'
import type { IFieldValueVisitor } from './field-value.visitor'
import type { IParentFieldValue } from './parent-field.type'

export class ParentFieldValue extends FieldValueBase<IParentFieldValue> {
  constructor(value: IParentFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.parent(this)
  }
}
