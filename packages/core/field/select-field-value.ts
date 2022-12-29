import { ValueObject } from '@egodb/domain'
import type { Option } from '../option'
import type { FieldValue } from './field.type'
import type { ISelectFieldValue } from './select-field.type'

export class SelectFieldValue extends ValueObject<ISelectFieldValue> {
  constructor(value: string) {
    super({ value })
  }

  static isSelectFieldValue(value?: FieldValue): value is SelectFieldValue {
    return value instanceof SelectFieldValue
  }

  static fromOption(o: Option): SelectFieldValue {
    return new this(o.id.value)
  }

  get id(): string {
    return this.props.value
  }
}
