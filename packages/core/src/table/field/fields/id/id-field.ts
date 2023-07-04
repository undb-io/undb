import { z } from 'zod'
import type { IRecordDisplayValues } from '../../../record/index.js'
import type { RecordValueJSON } from '../../../record/record.schema.js'
import { BaseField } from '../../field.base.js'
import { INTERNAL_COLUMN_ID_NAME } from '../../field.constants.js'
import { FieldCannotBeDuplicated } from '../../field.errors.js'
import type { IFieldVisitor } from '../../field.visitor.js'
import { IdFieldValue } from './id-field-value.js'
import type { ICreateIdFieldInput, ICreateIdFieldValue, IIdField, IdFieldType } from './id-field.type.js'
import type { IIdFilter, IIdFilterOperator } from './id.filter.js'

export class IdField extends BaseField<IIdField> {
  duplicate(name: string): IdField {
    throw new FieldCannotBeDuplicated()
  }
  type: IdFieldType = 'id'

  override get system() {
    return true
  }

  static default(): IdField {
    return this.create({ name: 'id' })
  }

  static create(input: Omit<ICreateIdFieldInput, 'type'>): IdField {
    return new IdField(super.createBase(input))
  }

  static unsafeCreate(input: ICreateIdFieldInput): IdField {
    return new IdField(super.unsafeCreateBase(input))
  }

  getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): string | null {
    return valueJson[INTERNAL_COLUMN_ID_NAME] ?? null
  }

  createValue(value: ICreateIdFieldValue): IdFieldValue {
    return new IdFieldValue(value)
  }

  createFilter(operator: IIdFilterOperator, value: string): IIdFilter {
    return { operator, value, path: this.id.value, type: 'id' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.id(this)
  }

  get valueSchema() {
    return z.string()
  }
}
