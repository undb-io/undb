import { FieldValueBase } from './field-value.base.js'
import type { IFieldValueVisitor } from './field-value.visitor.js'
import type { IParentFieldValue } from './parent-field.type.js'

export class ParentFieldValue extends FieldValueBase<IParentFieldValue> {
  constructor(value: IParentFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.parent(this)
  }
}
