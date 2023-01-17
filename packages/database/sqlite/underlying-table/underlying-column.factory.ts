import type { Field } from '@egodb/core'
import type { IUnderlyingColumn } from '../types/underlying-column'
import {
  UnderlyingBoolColumn,
  UnderlyingDateColumn,
  UnderlyingDateRangeFromColumn,
  UnderlyingDateRangeToFromColumn,
  UnderlyingNumberColumn,
  UnderlyingReferenceFromColumn,
  UnderlyingSelectFromColumn,
  UnderlyingStringColumn,
} from './underlying-column'

export class UnderlyingColumnFactory {
  static create(field: Field): IUnderlyingColumn | IUnderlyingColumn[] {
    switch (field.type) {
      case 'string':
        return new UnderlyingStringColumn(field)
      case 'number':
        return new UnderlyingNumberColumn(field)
      case 'bool':
        return new UnderlyingBoolColumn(field)
      case 'date':
        return new UnderlyingDateColumn(field)
      case 'date-range':
        return [new UnderlyingDateRangeFromColumn(field), new UnderlyingDateRangeToFromColumn(field)]
      case 'select':
        return new UnderlyingSelectFromColumn(field)
      case 'reference':
        return new UnderlyingReferenceFromColumn(field)
    }
  }

  static createMany(fields: Field[]): IUnderlyingColumn[] {
    return fields.flatMap((field) => this.create(field))
  }
}
