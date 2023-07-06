import { z } from 'zod'
import type { IRecordDisplayValues, RecordValueJSON } from '../../../record/index.js'
import { BaseField } from '../../field.base.js'
import type { IFieldVisitor } from '../../field.visitor.js'
import { FieldId } from '../../value-objects/field-id.vo.js'
import { NumberFieldValue } from './number-field-value.js'
import type { ICreateNumberFieldInput, ICreateNumberFieldValue, INumberField, NumberType } from './number-field.type.js'
import type { INumberFilter, INumberFilterOperator } from './number.filter.js'

export class NumberField extends BaseField<INumberField> {
  duplicate(name: string): NumberField {
    return NumberField.create({
      ...this.json,
      id: FieldId.createId(),
      name,
      display: false,
    })
  }
  type: NumberType = 'number'

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateNumberFieldInput, 'type'>): NumberField {
    return new NumberField(super.createBase(input))
  }

  static unsafeCreate(input: ICreateNumberFieldInput): NumberField {
    return new NumberField(super.unsafeCreateBase(input))
  }

  getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): number | null {
    return valueJson[this.id.value] ?? null
  }

  createValue(value: ICreateNumberFieldValue): NumberFieldValue {
    return new NumberFieldValue(value)
  }

  createFilter(operator: INumberFilterOperator, value: number | null): INumberFilter {
    return { operator, value, path: this.id.value, type: 'number' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.number(this)
  }

  get valueSchema() {
    const number = z.number()
    return this.required ? number : number.nullable()
  }
}
