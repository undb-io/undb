import type { Field } from '@egodb/core'
import type { IUnderlyingColumn } from '../interfaces/underlying-column.js'
import {
  UnderlyingAutoIncreamentColumn,
  UnderlyingBoolColumn,
  UnderlyingColorColumn,
  UnderlyingCreatedAtColumn,
  UnderlyingDateColumn,
  UnderlyingDateRangeFromColumn,
  UnderlyingDateRangeToFromColumn,
  UnderlyingEmailColumn,
  UnderlyingIdColumn,
  UnderlyingNumberColumn,
  UnderlyingParentColumn,
  UnderlyingRatingColumn,
  UnderlyingReferenceColumn,
  UnderlyingSelectFromColumn,
  UnderlyingStringColumn,
  UnderlyingTreeColumn,
  UnderlyingUpdatedAtColumn,
} from './underlying-column.js'

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
      case 'rating':
        return new UnderlyingRatingColumn(field)
      case 'color':
        return new UnderlyingColorColumn(field)
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
