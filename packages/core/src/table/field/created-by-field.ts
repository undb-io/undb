import type { Option } from 'oxide.ts'
import type { ZodTypeAny } from 'zod'
import { z } from 'zod'
import type { ICreatedByFilter } from '../filter/created-by.filter.js'
import type { ICreatedByFilterOperator } from '../filter/operators.js'
import { IRecordDisplayValues } from '../record/index.js'
import { RecordValueJSON } from '../record/record.schema.js'
import type { TableCompositeSpecificaiton } from '../specifications/index.js'
import { CreatedByFieldValue } from './created-by-field-value.js'
import type {
  CreatedByFieldType,
  ICreateCreatedByFieldInput,
  ICreatedByFieldQueryValue,
  IUpdateCreatedByFieldInput,
} from './created-by-field.type.js'
import { BaseField } from './field.base.js'
import { INTERNAL_COLUMN_CREATED_BY_PROFILE_NAME } from './field.constants.js'
import { FieldCannotBeDuplicated } from './field.errors.js'
import type { Field, ICreatedByField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'

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

  public override update(input: IUpdateCreatedByFieldInput): Option<TableCompositeSpecificaiton> {
    return this.updateBase(input)
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
