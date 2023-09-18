import type { JsonValue } from 'type-fest'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { IQRCodeFieldValue } from './qrcode-field.type.js'

export class QRCodeFieldValue extends FieldValueBase<IQRCodeFieldValue> {
  get json(): JsonValue {
    return this.props.value
  }
  constructor(value: IQRCodeFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.qrcode(this)
  }
}
