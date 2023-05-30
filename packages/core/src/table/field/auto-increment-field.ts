import { z } from 'zod'
import type { IAutoIncrementFilter } from '../filter/auto-increment.filter.js'
import type { IAutoIncrementFilterOperator } from '../filter/operators.js'
import type { IRecordDisplayValues } from '../record/index.js'
import type { RecordValueJSON } from '../record/record.schema.js'
import { AutoIncrementFieldValue } from './auto-increment-field-value.js'
import type {
  AutoIncrementFieldType,
  ICreateAutoIncrementFieldInput,
  ICreateAutoIncrementFieldValue,
} from './auto-increment-field.type.js'
import { BaseField } from './field.base.js'
import { INTERNAL_INCREAMENT_ID_NAME } from './field.constants.js'
import { FieldCannotBeDuplicated } from './field.errors.js'
import type { IAutoIncrementField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'

export class AutoIncrementField extends BaseField<IAutoIncrementField> {
  duplicate(name: string): AutoIncrementField {
    throw new FieldCannotBeDuplicated()
  }
  type: AutoIncrementFieldType = 'auto-increment'

  override get system() {
    return false
  }

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateAutoIncrementFieldInput, 'type'>): AutoIncrementField {
    return new AutoIncrementField(super.createBase(input))
  }

  static unsafeCreate(input: ICreateAutoIncrementFieldInput): AutoIncrementField {
    return new AutoIncrementField(super.unsafeCreateBase(input))
  }

  getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): string | null {
    return valueJson[INTERNAL_INCREAMENT_ID_NAME] ?? null
  }

  createValue(value: ICreateAutoIncrementFieldValue): AutoIncrementFieldValue {
    return new AutoIncrementFieldValue(value)
  }

  createFilter(operator: IAutoIncrementFilterOperator, value: number | null): IAutoIncrementFilter {
    return { operator, value, path: this.id.value, type: 'auto-increment' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.autoIncrement(this)
  }

  get valueSchema() {
    return z.number().int().positive()
  }
}
