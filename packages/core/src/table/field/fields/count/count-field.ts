import { z } from 'zod'
import type { IRecordDisplayValues, RecordValueJSON } from '../../../record/index.js'
import { AbstractLookupField, BaseField } from '../../field.base.js'
import type { Field } from '../../field.type.js'
import type { IFieldVisitor } from '../../field.visitor.js'
import { FieldId } from '../../value-objects/field-id.vo.js'
import { CountFieldValue } from './count-field-value.js'
import type { CountType, ICountField, ICreateCountFieldInput, ICreateCountFieldValue } from './count-field.type.js'
import type { ICountFilter, ICountFilterOperator } from './count.filter.js'

export class CountField extends AbstractLookupField<ICountField> {
  duplicate(name: string): Field {
    return CountField.create({
      ...this.json,
      id: FieldId.createId(),
      name,
      display: false,
    })
  }

  type: CountType = 'count'

  override get json() {
    return {
      ...super.json,
      referenceFieldId: this.referenceFieldId.value,
    }
  }

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateCountFieldInput, 'type'>): CountField {
    return new CountField({
      ...BaseField.createBase(input),
      referenceFieldId: FieldId.fromString(input.referenceFieldId),
    })
  }

  static unsafeCreate(input: ICreateCountFieldInput): CountField {
    return new CountField({
      ...BaseField.unsafeCreateBase(input),
      referenceFieldId: FieldId.fromString(input.referenceFieldId),
    })
  }

  getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): number | null {
    return valueJson[this.id.value] ?? null
  }

  createValue(value: ICreateCountFieldValue): CountFieldValue {
    return new CountFieldValue(value)
  }

  createFilter(operator: ICountFilterOperator, value: number | null): ICountFilter {
    return { operator, value, path: this.id.value, type: 'count' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.count(this)
  }

  get valueSchema() {
    const count = z.number().int().nonnegative()
    return this.required ? count : count.nullable()
  }
}
