import { and } from '@egodb/domain'
import { isArray } from 'lodash-es'
import type { Option } from 'oxide.ts'
import type { ISelectFilterOperator } from '../filter/operators.js'
import type { ISelectFilter, ISelectFilterValue } from '../filter/select.filter.js'
import type { ICreateOptionSchema, IUpdateOptionSchema } from '../option/index.js'
import { OptionKey } from '../option/index.js'
import { Options } from '../option/options.js'
import type { TableCompositeSpecificaiton } from '../specifications/interface.js'
import { BaseField } from './field.base.js'
import type { ISelectField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { SelectFieldValue } from './select-field-value.js'
import type {
  ICreateSelectFieldSchema,
  ICreateSelectFieldValue,
  IUpdateSelectFieldInput,
  SelectFieldType,
} from './select-field.type.js'
import { WithNewOption, WithOption, WithOptions, WithoutOption } from './specifications/select-field.specification.js'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects/index.js'

export class SelectField extends BaseField<ISelectField> {
  type: SelectFieldType = 'select'

  get options() {
    return this.props.options
  }

  set options(options: Options) {
    this.props.options = options
  }

  override get primitive() {
    return true
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

  public override update(input: IUpdateSelectFieldInput): Option<TableCompositeSpecificaiton> {
    const specs: TableCompositeSpecificaiton[] = []
    const spec = super.updateBase(input)
    if (spec.isSome()) {
      specs.push(spec.unwrap())
    }

    if (isArray(input.options)) {
      const options = Options.create(input.options)
      specs.push(new WithOptions(this, options))
    }

    return and(...specs)
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
