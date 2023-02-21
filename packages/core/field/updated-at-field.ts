import type { IUpdatedAtFilterOperator } from '../filter/operators.js'
import type { IUpdatedAtFilter } from '../filter/updated-at.filter.js'
import { BaseField } from './field.base.js'
import type { IUpdatedAtField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { UpdatedAtFieldValue } from './updated-at-field-value.js'
import type {
  ICreateUpdatedAtFieldInput,
  ICreateUpdatedAtFieldValue,
  UpdatedAtFieldType,
} from './updated-at-field.type.js'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects/index.js'

export class UpdatedAtField extends BaseField<IUpdatedAtField> {
  type: UpdatedAtFieldType = 'updated-at'
  override get system() {
    return true
  }

  override get primitive() {
    return true
  }

  static default(): UpdatedAtField {
    return this.create({
      name: 'updatedAt',
    })
  }

  static create(input: Omit<ICreateUpdatedAtFieldInput, 'type'>): UpdatedAtField {
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
