import type { IIdFilter } from '../filter/id.filter'
import type { IIdFilterOperator } from '../filter/operators'
import { BaseField } from './field.base'
import type { IIdField } from './field.type'
import type { IFieldVisitor } from './field.visitor'
import { IdFieldValue } from './id-field-value'
import type { ICreateIdFieldInput, ICreateIdFieldValue, IdFieldType } from './id-field.type'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects'

export class IdField extends BaseField<IIdField> {
  type: IdFieldType = 'id'
  system = true

  static default(): IdField {
    return this.create({
      type: 'id',
      name: 'id',
    })
  }

  static create(input: ICreateIdFieldInput): IdField {
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
