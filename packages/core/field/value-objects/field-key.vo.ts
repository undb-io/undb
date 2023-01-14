import { ValueObject } from '@egodb/domain'
import type { FieldName } from './field-name.vo'

export class FieldKey extends ValueObject<string> {
  public get value(): string {
    return this.props.value
  }

  static fromName(fieldName: FieldName): FieldKey {
    return new this({ value: fieldName.value })
  }

  static from(key: string): FieldKey {
    return new this({ value: key })
  }
}
