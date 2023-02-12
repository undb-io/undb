import type { IBoolFilter } from '../filter/bool.filter.js'
import type { IBoolFilterOperator } from '../filter/operators.js'
import { BoolFieldValue } from './bool-field-value.js'
import type { BoolFieldType, ICreateBoolFieldInput, ICreateBoolFieldValue } from './bool-field.type.js'
import { BaseField } from './field.base.js'
import type { IBoolField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects/index.js'

export class BoolField extends BaseField<IBoolField> {
  type: BoolFieldType = 'bool'

  static create(input: Omit<ICreateBoolFieldInput, 'type'>): BoolField {
    const fieldName = FieldName.create(input.name)
    return new BoolField({
      id: FieldId.fromNullableString(input.id),
      name: fieldName,
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateBoolFieldInput): BoolField {
    return new BoolField({
      id: FieldId.fromNullableString(input.id),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
    })
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
}
