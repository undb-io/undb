import type { Field as CoreField } from '@egodb/core'
import type { Field } from './field'
import { BoolField, DateField, DateRangeField, NumberField, ReferenceField, SelectField, StringField } from './field'
import type { Table } from './table'

export class FieldFactory {
  static createMany(table: Table, fields: CoreField[]): Field[] {
    return fields.map((field) => this.create(table, field)).filter(Boolean) as Field[]
  }

  static create(table: Table, field: CoreField): Field {
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
      case 'reference':
        return new ReferenceField(table, field)
    }
  }
}
