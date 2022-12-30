import type { ISelectFilterOperator } from '../filter/operators'
import type { ISelectFilter, ISelectFilterValue } from '../filter/select.filter'
import { Options } from '../option/options'
import { BaseField } from './field.base'
import type { ISelectField } from './field.type'
import { SelectFieldValue } from './select-field-value'
import type { ICreateSelectFieldSchema, ICreateSelectFieldValue, SelectFieldType } from './select-field.type'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects'

export class SelectField extends BaseField<ISelectField> {
  get type(): SelectFieldType {
    return 'select'
  }

  get options() {
    return this.props.options
  }

  static create(input: ICreateSelectFieldSchema): SelectField {
    return new SelectField({
      id: FieldId.from(input.id),
      name: FieldName.create(input.name),
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
      options: Options.create(input.options),
    })
  }

  static unsafeCreate(input: ICreateSelectFieldSchema): SelectField {
    return new SelectField({
      id: FieldId.from(input.id),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
      options: Options.unsafeCreate(input.options),
    })
  }

  createFilter(operator: ISelectFilterOperator, value: ISelectFilterValue): ISelectFilter {
    return { operator, value, path: this.name.value, type: 'select' }
  }

  createValue(value: ICreateSelectFieldValue): SelectFieldValue {
    const option = this.options.getById(value).unwrap()

    return SelectFieldValue.fromOption(option)
  }
}
