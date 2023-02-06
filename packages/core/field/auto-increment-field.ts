import type { IAutoIncrementFilter } from '../filter/auto-increment.filter'
import type { IAutoIncrementFilterOperator } from '../filter/operators'
import { AutoIncrementFieldValue } from './auto-increment-field-value'
import type {
  AutoIncrementFieldType,
  ICreateAutoIncrementFieldInput,
  ICreateAutoIncrementFieldValue,
} from './auto-increment-field.type'
import { BaseField } from './field.base'
import type { IAutoIncrementField } from './field.type'
import type { IFieldVisitor } from './field.visitor'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects'

export class AutoIncrementField extends BaseField<IAutoIncrementField> {
  type: AutoIncrementFieldType = 'auto-increment'
  system = true

  static create(input: Omit<ICreateAutoIncrementFieldInput, 'type'>): AutoIncrementField {
    const fieldName = FieldName.create(input.name)
    return new AutoIncrementField({
      id: FieldId.fromNullableString(input.id),
      name: fieldName,
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateAutoIncrementFieldInput): AutoIncrementField {
    return new AutoIncrementField({
      id: FieldId.fromNullableString(input.id),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
    })
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
}
