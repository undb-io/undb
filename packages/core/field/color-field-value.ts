import type { IColorFieldValue } from './color-field.type'
import { FieldValueBase } from './field-value.base'
import type { IFieldValueVisitor } from './field-value.visitor'

export class ColorFieldValue extends FieldValueBase<IColorFieldValue> {
  constructor(value: IColorFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.color(this)
  }
}
