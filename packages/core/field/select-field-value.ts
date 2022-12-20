import { ValueObject } from '@egodb/domain'
import type { FieldValue } from './field.type'
import type { ISelectFieldValue } from './select-field.type'

export const isSelectFieldValue = (value?: FieldValue): value is SelectFieldValue => value instanceof SelectFieldValue

export class SelectFieldValue extends ValueObject<ISelectFieldValue> {
  get option(): string | null {
    return this.props.name
  }
}
