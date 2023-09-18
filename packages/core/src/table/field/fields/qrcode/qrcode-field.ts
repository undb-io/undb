import { z } from 'zod'
import type { RecordValueJSON } from '../../../record/record.schema.js'
import type { IRecordDisplayValues } from '../../../record/record.type.js'
import { BaseField } from '../../field.base.js'
import type { IFieldVisitor } from '../../field.visitor.js'
import { FieldId } from '../../value-objects/field-id.vo.js'
import { QRCodeFieldValue } from './qrcode-field-value.js'
import type {
  ICreateQRCodeFieldInput,
  ICreateQRCodeFieldValue,
  IQRCodeField,
  QRCodeFieldType,
} from './qrcode-field.type.js'
import type { IQRCodeFilter, IQRCodeFilterOperator } from './qrcode.filter.js'

export class QRCodeField extends BaseField<IQRCodeField> {
  duplicate(name: string): QRCodeField {
    return QRCodeField.create({
      ...this.json,
      id: FieldId.createId(),
      name,
      display: false,
    })
  }
  type: QRCodeFieldType = 'qrcode'

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateQRCodeFieldInput, 'type'>): QRCodeField {
    return new QRCodeField(super.createBase(input))
  }

  static unsafeCreate(input: ICreateQRCodeFieldInput): QRCodeField {
    return new QRCodeField(super.unsafeCreateBase(input))
  }

  getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): string | null {
    return valueJson[this.id.value] ?? null
  }

  createValue(value: ICreateQRCodeFieldValue): QRCodeFieldValue {
    return new QRCodeFieldValue(value)
  }

  createFilter(operator: IQRCodeFilterOperator, value: null): IQRCodeFilter {
    return { operator, value, path: this.id.value, type: 'qrcode' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.qrcode(this)
  }

  get valueSchema() {
    const qrcode = z.string()
    return this.required ? qrcode : qrcode.nullable()
  }
}
