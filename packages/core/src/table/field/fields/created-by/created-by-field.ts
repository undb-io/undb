import type { ZodTypeAny } from 'zod'
import { z } from 'zod'
import type { IRecordDisplayValues } from '../../../record/index.js'
import type { RecordValueJSON } from '../../../record/record.schema.js'
import { BaseField } from '../../field.base.js'
import { INTERNAL_COLUMN_CREATED_BY_PROFILE_NAME } from '../../field.constants.js'
import { FieldCannotBeDuplicated } from '../../field.errors.js'
import type { Field } from '../../field.type.js'
import type { IFieldVisitor } from '../../field.visitor.js'
import { CreatedByFieldValue } from './created-by-field-value.js'
import type {
  CreatedByFieldType,
  ICreateCreatedByFieldInput,
  ICreatedByField,
  ICreatedByFieldQueryValue,
} from './created-by-field.type.js'
import type { ICreatedByFilter, ICreatedByFilterOperator } from './created-by.filter.js'

export class CreatedByField extends BaseField<ICreatedByField> {
  duplicate(name: string): Field {
    throw new FieldCannotBeDuplicated()
  }
  type: CreatedByFieldType = 'created-by'

  override get system() {
    return true
  }

  override get primitive() {
    return true
  }

  static default(name: string): CreatedByField {
    return this.create({ name })
  }

  static create(input: Omit<ICreateCreatedByFieldInput, 'type'>): CreatedByField {
    return new CreatedByField({
      ...super.createBase(input),
    })
  }

  static unsafeCreate(input: ICreateCreatedByFieldInput): CreatedByField {
    return new CreatedByField({
      ...super.unsafeCreateBase(input),
    })
  }

  getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): string | null {
    const profile = valueJson[INTERNAL_COLUMN_CREATED_BY_PROFILE_NAME]
    return profile?.username ?? null
  }
  createValue(value: ICreatedByFieldQueryValue): CreatedByFieldValue {
    return CreatedByFieldValue.fromQuery(value)
  }

  createFilter(operator: ICreatedByFilterOperator, value: string): ICreatedByFilter {
    return { operator, value, path: this.id.value, type: 'created-by' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.createdBy(this)
  }

  get valueSchema(): ZodTypeAny {
    return z.any()
  }
}
