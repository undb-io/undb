import type { ICreatedAtFilter } from '../filter/created-at.filter.js'
import type { ICreatedAtFilterOperator } from '../filter/operators.js'
import { CreatedAtFieldValue } from './created-at-field-value.js'
import type {
  CreatedAtFieldType,
  ICreateCreatedAtFieldInput,
  ICreateCreatedAtFieldValue,
} from './created-at-field.type.js'
import { BaseDateField } from './field.base.js'
import type { ICreatedAtField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { DateFormat, FieldId, FieldName, FieldValueConstraints } from './value-objects/index.js'

export class CreatedAtField extends BaseDateField<ICreatedAtField> {
  type: CreatedAtFieldType = 'created-at'
  override get system() {
    return true
  }

  override get primitive() {
    return true
  }

  static default(): CreatedAtField {
    return this.create({ name: 'createdAt' })
  }

  static create(input: Omit<ICreateCreatedAtFieldInput, 'type'>): CreatedAtField {
    const fieldName = FieldName.create(input.name)
    return new CreatedAtField({
      id: FieldId.fromNullableString(input.id),
      name: fieldName,
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
      format: input.format ? DateFormat.fromString(input.format) : undefined,
    })
  }

  static unsafeCreate(input: ICreateCreatedAtFieldInput): CreatedAtField {
    return new CreatedAtField({
      id: FieldId.fromNullableString(input.id),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
      format: input.format ? DateFormat.fromString(input.format) : undefined,
    })
  }

  createValue(value: ICreateCreatedAtFieldValue): CreatedAtFieldValue {
    return new CreatedAtFieldValue(value)
  }

  createFilter(operator: ICreatedAtFilterOperator, value: string | null): ICreatedAtFilter {
    return { operator, value, path: this.id.value, type: 'created-at' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.createdAt(this)
  }
}
