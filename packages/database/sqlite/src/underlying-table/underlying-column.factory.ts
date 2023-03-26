import type { Field } from '@egodb/core'
import type { IUnderlyingColumn } from '../interfaces/underlying-column.js'
import {
  UnderlyingAutoIncreamentColumn,
  UnderlyingAverageColumn,
  UnderlyingBoolColumn,
  UnderlyingColorColumn,
  UnderlyingCountColumn,
  UnderlyingCreatedAtColumn,
  UnderlyingDateColumn,
  UnderlyingDateRangeFromColumn,
  UnderlyingDateRangeToFromColumn,
  UnderlyingEmailColumn,
  UnderlyingIdColumn,
  UnderlyingLookupColumn,
  UnderlyingNumberColumn,
  UnderlyingParentColumn,
  UnderlyingRatingColumn,
  UnderlyingReferenceColumn,
  UnderlyingSelectColumn,
  UnderlyingStringColumn,
  UnderlyingSumColumn,
  UnderlyingTreeColumn,
  UnderlyingUpdatedAtColumn,
} from './underlying-column.js'

export class UnderlyingColumnFactory {
  static create(field: Field, tableName: string): IUnderlyingColumn | IUnderlyingColumn[] {
    switch (field.type) {
      case 'id':
        return new UnderlyingIdColumn(field, tableName)
      case 'created-at':
        return new UnderlyingCreatedAtColumn(field, tableName)
      case 'updated-at':
        return new UnderlyingUpdatedAtColumn(field, tableName)
      case 'auto-increment':
        return new UnderlyingAutoIncreamentColumn(field, tableName)
      case 'string':
        return new UnderlyingStringColumn(field, tableName)
      case 'email':
        return new UnderlyingEmailColumn(field, tableName)
      case 'rating':
        return new UnderlyingRatingColumn(field, tableName)
      case 'color':
        return new UnderlyingColorColumn(field, tableName)
      case 'number':
        return new UnderlyingNumberColumn(field, tableName)
      case 'bool':
        return new UnderlyingBoolColumn(field, tableName)
      case 'date':
        return new UnderlyingDateColumn(field, tableName)
      case 'date-range':
        return [
          new UnderlyingDateRangeFromColumn(field, tableName),
          new UnderlyingDateRangeToFromColumn(field, tableName),
        ]
      case 'select':
        return new UnderlyingSelectColumn(field, tableName)
      case 'reference':
        return new UnderlyingReferenceColumn(field, tableName)
      case 'tree':
        return new UnderlyingTreeColumn(field, tableName)
      case 'parent':
        return new UnderlyingParentColumn(field, tableName)
      case 'count':
        return new UnderlyingCountColumn(field, tableName)
      case 'sum':
        return new UnderlyingSumColumn(field, tableName)
      case 'average':
        return new UnderlyingAverageColumn(field, tableName)
      case 'lookup':
        return new UnderlyingLookupColumn(field, tableName)
    }
  }

  static createMany(fields: Field[], tableName: string): IUnderlyingColumn[] {
    return fields.flatMap((field) => this.create(field, tableName))
  }
}
