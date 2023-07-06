import { isBoolean } from 'lodash-es'
import { z } from 'zod'
import type { RecordValueJSON } from '../../../record/record.schema.js'
import type { IRecordDisplayValues } from '../../../record/record.type.js'
import { BaseField } from '../../field.base.js'
import type { IFieldVisitor } from '../../field.visitor.js'
import { FieldId } from '../../value-objects/field-id.vo.js'
import { BoolFieldValue } from './bool-field-value.js'
import type { BoolFieldType, IBoolField, ICreateBoolFieldInput, ICreateBoolFieldValue } from './bool-field.type.js'
import type { IBoolFilter, IBoolFilterOperator } from './bool.filter.js'

export class BoolField extends BaseField<IBoolField> {
  duplicate(name: string): BoolField {
    return BoolField.create({
      ...super.json,
      id: FieldId.createId(),
      name,
      display: false,
    })
  }

  type: BoolFieldType = 'bool'

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateBoolFieldInput, 'type'>): BoolField {
    return new BoolField(super.createBase(input))
  }

  static unsafeCreate(input: ICreateBoolFieldInput): BoolField {
    return new BoolField(super.unsafeCreateBase(input))
  }

  getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): string | null {
    const value = valueJson[this.id.value]
    if (isBoolean(value)) return String(value)
    return null
  }
  createValue(value: ICreateBoolFieldValue): BoolFieldValue {
    return new BoolFieldValue(value)
  }

  createFilter(operator: IBoolFilterOperator, value: boolean | null): IBoolFilter {
    return { operator, value, path: this.id.value, type: 'bool' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.bool(this)
  }

  get valueSchema() {
    const bool = z.boolean()

    return this.required ? bool : bool.nullable()
  }
}
