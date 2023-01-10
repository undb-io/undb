import type { Field } from '@egodb/core'
import { BoolField, DateField, DateRangeField, NumberField, SelectField, StringField } from './field'
import type { Table } from './table'

export class FieldFactory {
  static create(table: Table, field: Field) {
    switch (field.type) {
      case 'string':
        return new StringField(table, field)
      case 'number':
        return new NumberField(table, field)
      case 'date':
        return new DateField(table, field)
      case 'date-range':
        return new DateRangeField(table, field)
      case 'bool':
        return new BoolField(table, field)
      case 'select':
        return new SelectField(table, field)
    }
  }
}
