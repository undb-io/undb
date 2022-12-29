import { ValueObject } from '@egodb/domain'
import type { FieldValue } from './field.type'
import type { ISelectFieldValue } from './select-field.type'

export class SelectFieldValue extends ValueObject<ISelectFieldValue> {
  static isSelectFieldValue(value?: FieldValue): value is SelectFieldValue {
    return value instanceof SelectFieldValue
  }

  get id(): string {
    return this.props.id
  }

  get name(): string | null {
    return this.props.name
  }
}
