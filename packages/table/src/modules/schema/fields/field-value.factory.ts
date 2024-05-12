import { match } from 'ts-pattern'
import type { Field, FieldValue } from './field.type'
import { NumberFieldValue, StringFieldValue } from './variants'

export class FieldValueFactory {
  static create(field: Field, value: any): FieldValue {
    const v = field.valueSchema.parse(value)
    return match(field.type)
      .with('number', () => new NumberFieldValue(v as number))
      .with('string', () => new StringFieldValue(v as string))
      .exhaustive()
  }
}
