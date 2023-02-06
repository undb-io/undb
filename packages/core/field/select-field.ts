import type { ISelectFilterOperator } from '../filter/operators'
import type { ISelectFilter, ISelectFilterValue } from '../filter/select.filter'
import type { ICreateOptionSchema, IUpdateOptionSchema } from '../option'
import { OptionKey } from '../option'
import { Options } from '../option/options'
import { BaseField } from './field.base'
import type { ISelectField } from './field.type'
import type { IFieldVisitor } from './field.visitor'
import { SelectFieldValue } from './select-field-value'
import type { ICreateSelectFieldSchema, ICreateSelectFieldValue, SelectFieldType } from './select-field.type'
import { WithNewOption, WithOption, WithOptions, WithoutOption } from './specifications/select-field.specification'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects'

export class SelectField extends BaseField<ISelectField> {
  type: SelectFieldType = 'select'

  get options() {
    return this.props.options
  }

  set options(options: Options) {
    this.props.options = options
  }

  reorder(from: string, to: string): WithOptions {
    const options = this.options.reorder(from, to)
    return new WithOptions(this, options)
  }

  createOption(input: ICreateOptionSchema): WithNewOption {
    const option = this.options.createOption(input)
    return new WithNewOption(this, option)
  }

  updateOption(id: string, input: IUpdateOptionSchema): WithOption {
    const option = this.options.getById(id).unwrap()

    return new WithOption(this, option.updateOption(input))
  }

  removeOption(id: string): WithoutOption {
    const optionKey = OptionKey.fromString(id)
    return new WithoutOption(this, optionKey)
  }

  static create(input: Omit<ICreateSelectFieldSchema, 'type'>): SelectField {
    const fieldName = FieldName.create(input.name)

    return new SelectField({
      id: FieldId.fromNullableString(input.id),
      name: fieldName,
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
      options: Options.create(input.options),
    })
  }

  static unsafeCreate(input: ICreateSelectFieldSchema): SelectField {
    return new SelectField({
      id: FieldId.fromNullableString(input.id),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
      options: Options.unsafeCreate(input.options),
    })
  }

  createFilter(operator: ISelectFilterOperator, value: ISelectFilterValue): ISelectFilter {
    return { operator, value, path: this.id.value, type: 'select' }
  }

  createValue(value: ICreateSelectFieldValue): SelectFieldValue {
    if (value === null) {
      return new SelectFieldValue(null)
    }

    const option = this.options.getById(value).unwrap()

    return SelectFieldValue.fromOption(option)
  }

  accept(visitor: IFieldVisitor): void {
    visitor.select(this)
  }
}
