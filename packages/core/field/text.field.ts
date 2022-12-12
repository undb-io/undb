import type { IStringFilter, IStringFilterOperator } from '../filter'
import { BaseField } from './field.base'
import type { ITextField } from './field.type'
import { TextFieldValue } from './text-field-value'
import type { ICreateTextFieldInput, ICreateTextFieldValue, TextFieldType } from './text-field.type'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects'

export class TextField extends BaseField<ITextField> {
  get type(): TextFieldType {
    return 'text'
  }

  static create(input: ICreateTextFieldInput): TextField {
    return new TextField({
      id: FieldId.from(input.id),
      name: FieldName.create(input.name),
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateTextFieldInput): TextField {
    return new TextField({
      id: FieldId.from(input.id),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
    })
  }

  createValue(value: ICreateTextFieldValue): TextFieldValue {
    return new TextFieldValue(value)
  }

  validateNewValue(value: string): boolean {
    return value.length > 0
  }

  createFilter(operator: IStringFilterOperator, value: string | null): IStringFilter {
    return { operator, value, path: this.name.value, type: 'string' }
  }
}
