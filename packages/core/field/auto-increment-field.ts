import type { IAutoIncrementFilter } from '../filter/auto-increment.filter.js'
import type { IAutoIncrementFilterOperator } from '../filter/operators.js'
import { AutoIncrementFieldValue } from './auto-increment-field-value.js'
import type {
  AutoIncrementFieldType,
  ICreateAutoIncrementFieldInput,
  ICreateAutoIncrementFieldValue,
} from './auto-increment-field.type.js'
import { BaseField } from './field.base.js'
import type { IAutoIncrementField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects/index.js'

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
