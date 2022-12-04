import type { Field, ICreateFieldSchema } from './field.type'
import { NumberField } from './number.field'
import { TextField } from './text.field'

export class FieldFactory {
  static create(input: ICreateFieldSchema): Field {
    switch (input.type) {
      case 'text': {
        return TextField.create(input)
      }
      case 'number': {
        return NumberField.create(input)
      }

      default:
        throw new Error('invalid text field type')
    }
  }

  static unsafeCreate(input: ICreateFieldSchema): Field {
    switch (input.type) {
      case 'text': {
        return TextField.unsafeCreate(input)
      }
      case 'number': {
        return NumberField.unsafeCreate(input)
      }

      default:
        throw new Error('invalid text field type')
    }
  }
}
