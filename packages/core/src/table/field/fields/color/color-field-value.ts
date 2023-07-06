import type { JsonValue } from 'type-fest'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { IColorFieldValue } from './color-field.type.js'

export const DEFAULT_COLOR = '#5C7CFA'

export class ColorFieldValue extends FieldValueBase<IColorFieldValue> {
  get json(): JsonValue {
    return this.props.value
  }
  constructor(value: IColorFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.color(this)
  }
}
