import type { IIdFilter } from '../filter/id.filter.js'
import type { IIdFilterOperator } from '../filter/operators.js'
import { BaseField } from './field.base.js'
import type { IIdField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { IdFieldValue } from './id-field-value.js'
import type { ICreateIdFieldInput, ICreateIdFieldValue, IdFieldType } from './id-field.type.js'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects/index.js'

export class IdField extends BaseField<IIdField> {
  type: IdFieldType = 'id'
  system = true

  static default(): IdField {
    return this.create({ name: 'id' })
  }

  static create(input: Omit<ICreateIdFieldInput, 'type'>): IdField {
    const fieldName = FieldName.create(input.name)
    return new IdField({
      id: FieldId.fromNullableString(input.id),
      name: fieldName,
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateIdFieldInput): IdField {
    return new IdField({
      id: FieldId.fromNullableString(input.id),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
    })
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
}
