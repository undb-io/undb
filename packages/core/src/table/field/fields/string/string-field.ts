import { z } from 'zod'
import type { RecordValueJSON } from '../../../record/record.schema.js'
import type { IRecordDisplayValues } from '../../../record/record.type.js'
import { BaseField } from '../../field.base.js'
import type { IFieldVisitor } from '../../field.visitor.js'
import { FieldId } from '../../value-objects/field-id.vo.js'
import { StringFieldValue } from './string-field-value.js'
import type {
  ICreateStringFieldInput,
  ICreateStringFieldValue,
  IStringField,
  StringFieldType,
} from './string-field.type.js'
import type { IStringFilter, IStringFilterOperator } from './string.filter.js'

export class StringField extends BaseField<IStringField> {
  duplicate(name: string): StringField {
    return StringField.create({
      ...this.json,
      id: FieldId.createId(),
      name,
      display: false,
    })
  }
  type: StringFieldType = 'string'

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateStringFieldInput, 'type'>): StringField {
    return new StringField(super.createBase(input))
  }

  static unsafeCreate(input: ICreateStringFieldInput): StringField {
    return new StringField(super.unsafeCreateBase(input))
  }

  getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): string | null {
    return valueJson[this.id.value] ?? null
  }

  createValue(value: ICreateStringFieldValue): StringFieldValue {
    return new StringFieldValue(value)
  }

  createFilter(operator: IStringFilterOperator, value: string | null): IStringFilter {
    return { operator, value, path: this.id.value, type: 'string' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.string(this)
  }

  get valueSchema() {
    const str = z.string()
    return this.required ? str.min(1) : str.nullable()
  }
}
