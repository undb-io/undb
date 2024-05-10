import type { Field, FieldValue } from './field.type'
import { NumberFieldValue, StringFieldValue } from './variants'

export class FieldValueFactory {
  static create(field: Field, value: any): FieldValue {
    const v = field.valueSchema.parse(value)
    switch (field.type) {
      case 'string': {
        return new StringFieldValue(v as string)
      }
      case 'number': {
        return new NumberFieldValue(v as number)
      }

      default: {
        throw new Error(`Unknown field type: ${field.type}`)
      }
    }
  }
}
