import type { IColorFieldValue } from './color-field.type.js'
import { FieldValueBase } from './field-value.base.js'
import type { IFieldValueVisitor } from './field-value.visitor.js'

export const DEFAULT_COLOR = '#5C7CFA'

export class ColorFieldValue extends FieldValueBase<IColorFieldValue> {
  constructor(value: IColorFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.color(this)
  }
}
