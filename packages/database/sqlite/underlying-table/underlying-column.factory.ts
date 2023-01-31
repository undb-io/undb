import type { Field } from '@egodb/core'
import type { IUnderlyingColumn } from '../interfaces/underlying-column'
import {
  UnderlyingAutoIncreamentColumn,
  UnderlyingBoolColumn,
  UnderlyingCreatedAtColumn,
  UnderlyingDateColumn,
  UnderlyingDateRangeFromColumn,
  UnderlyingDateRangeToFromColumn,
  UnderlyingEmailColumn,
  UnderlyingIdColumn,
  UnderlyingNumberColumn,
  UnderlyingParentColumn,
  UnderlyingReferenceColumn,
  UnderlyingSelectFromColumn,
  UnderlyingStringColumn,
  UnderlyingTreeColumn,
  UnderlyingUpdatedAtColumn,
} from './underlying-column'

export class UnderlyingColumnFactory {
  static create(field: Field): IUnderlyingColumn | IUnderlyingColumn[] {
    switch (field.type) {
      case 'id':
        return new UnderlyingIdColumn()
      case 'created-at':
        return new UnderlyingCreatedAtColumn()
      case 'updated-at':
        return new UnderlyingUpdatedAtColumn()
      case 'auto-increment':
        return new UnderlyingAutoIncreamentColumn()
      case 'string':
        return new UnderlyingStringColumn(field)
      case 'email':
        return new UnderlyingEmailColumn(field)
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
        return new UnderlyingReferenceColumn(field)
      case 'tree':
        return new UnderlyingTreeColumn(field)
      case 'parent':
        return new UnderlyingParentColumn(field)
    }
  }

  static createMany(fields: Field[]): IUnderlyingColumn[] {
    return fields.flatMap((field) => this.create(field))
  }
}
