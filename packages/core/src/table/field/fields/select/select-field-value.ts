import type { Option as O } from 'oxide.ts'
import { None } from 'oxide.ts'
import type { JsonValue } from 'type-fest'
import type { Option } from '../../../option/index.js'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { FieldValue } from '../../field.type.js'
import type { SelectField } from './select-field.js'
import type { ISelectFieldValue } from './select-field.type.js'

export class SelectFieldValue extends FieldValueBase<ISelectFieldValue> {
  get json(): JsonValue {
    return this.props.value
  }
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
