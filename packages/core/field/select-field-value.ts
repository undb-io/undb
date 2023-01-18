import type { Option as O } from 'oxide.ts'
import { None } from 'oxide.ts'
import type { Option } from '../option'
import { FieldValueBase } from './field-value.base'
import type { IFieldValueVisitor } from './field-value.visitor'
import type { FieldValue } from './field.type'
import type { SelectField } from './select-field'
import type { ISelectFieldValue } from './select-field.type'

export class SelectFieldValue extends FieldValueBase<ISelectFieldValue> {
  constructor(value: ISelectFieldValue) {
    super({ value })
  }

  static isSelectFieldValue(value?: FieldValue): value is SelectFieldValue {
    return value instanceof SelectFieldValue
  }

  static fromOption(o: Option): SelectFieldValue {
    return new this(o.key.value)
  }

  get id(): ISelectFieldValue {
    return this.props.value
  }

  getOption(field: SelectField): O<Option> {
    if (!this.id) return None
    return field.options.getById(this.id)
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.select(this)
  }
}
