import type { Field } from '@egodb/core'
import { BoolField, DateField, DateRangeField, NumberField, SelectField, StringField } from './field'

export class FieldFactory {
  static create(field: Field) {
    switch (field.type) {
      case 'string':
        return new StringField()
      case 'number':
        return new NumberField()
      case 'date':
        return new DateField()
      case 'date-range':
        return new DateRangeField()
      case 'bool':
        return new BoolField()
      case 'select':
        return new SelectField()
    }
  }
}
