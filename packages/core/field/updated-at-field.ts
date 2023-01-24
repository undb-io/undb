import type { IUpdatedAtFilterOperator } from '../filter/operators'
import type { IUpdatedAtFilter } from '../filter/updated-at.filter'
import { BaseField } from './field.base'
import type { IUpdatedAtField } from './field.type'
import type { IFieldVisitor } from './field.visitor'
import { UpdatedAtFieldValue } from './updated-at-field-value'
import type {
  ICreateUpdatedAtFieldInput,
  ICreateUpdatedAtFieldValue,
  UpdatedAtFieldType,
} from './updated-at-field.type'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects'

export class UpdatedAtField extends BaseField<IUpdatedAtField> {
  type: UpdatedAtFieldType = 'updated-at'
  system = true

  static default(): UpdatedAtField {
    return this.create({
      name: 'updatedAt',
      type: 'updated-at',
    })
  }

  static create(input: ICreateUpdatedAtFieldInput): UpdatedAtField {
    const fieldName = FieldName.create(input.name)
    return new UpdatedAtField({
      id: FieldId.fromNullableString(input.id),
      name: fieldName,
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateUpdatedAtFieldInput): UpdatedAtField {
    return new UpdatedAtField({
      id: FieldId.fromNullableString(input.id),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
    })
  }

  createValue(value: ICreateUpdatedAtFieldValue): UpdatedAtFieldValue {
    return new UpdatedAtFieldValue(value)
  }

  createFilter(operator: IUpdatedAtFilterOperator, value: Date | null): IUpdatedAtFilter {
    return { operator, value, path: this.id.value, type: 'updated-at' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.updatedAt(this)
  }
}
