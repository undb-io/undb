import type { Field } from '@undb/core'
import type { IUnderlyingColumn } from '../interfaces/underlying-column.js'
import {
  UnderlyingAttachmentColumn,
  UnderlyingAutoIncrementColumn,
  UnderlyingAverageColumn,
  UnderlyingBoolColumn,
  UnderlyingCollaboratorColumn,
  UnderlyingColorColumn,
  UnderlyingCountColumn,
  UnderlyingCreatedAtColumn,
  UnderlyingCreatedByColumn,
  UnderlyingCurrencyColumn,
  UnderlyingDateColumn,
  UnderlyingDateRangeFromColumn,
  UnderlyingDateRangeToColumn,
  UnderlyingEmailColumn,
  UnderlyingIdColumn,
  UnderlyingJsonColumn,
  UnderlyingLookupColumn,
  UnderlyingMaxColumn,
  UnderlyingMinColumn,
  UnderlyingMultiSelectColumn,
  UnderlyingNumberColumn,
  UnderlyingParentColumn,
  UnderlyingQRCodeColumn,
  UnderlyingRatingColumn,
  UnderlyingReferenceColumn,
  UnderlyingSelectColumn,
  UnderlyingStringColumn,
  UnderlyingSumColumn,
  UnderlyingTreeColumn,
  UnderlyingUpdatedAtColumn,
  UnderlyingUpdatedByColumn,
  UnderlyingUrlColumn,
} from './underlying-column.js'

export class UnderlyingColumnFactory {
  static create(field: Field, tableName: string): IUnderlyingColumn | IUnderlyingColumn[] {
    switch (field.type) {
      case 'id':
        return new UnderlyingIdColumn(field.id.value, tableName)
      case 'created-at':
        return new UnderlyingCreatedAtColumn(field.id.value, tableName)
      case 'updated-at':
        return new UnderlyingUpdatedAtColumn(field.id.value, tableName)
      case 'auto-increment':
        return new UnderlyingAutoIncrementColumn(field.id.value, tableName)
      case 'string':
        return new UnderlyingStringColumn(field.id.value, tableName)
      case 'email':
        return new UnderlyingEmailColumn(field.id.value, tableName)
      case 'url':
        return new UnderlyingUrlColumn(field.id.value, tableName)
      case 'json':
        return new UnderlyingJsonColumn(field.id.value, tableName)
      case 'attachment':
        return new UnderlyingAttachmentColumn(field.id.value, tableName)
      case 'rating':
        return new UnderlyingRatingColumn(field.id.value, tableName)
      case 'currency':
        return new UnderlyingCurrencyColumn(field.id.value, tableName)
      case 'color':
        return new UnderlyingColorColumn(field.id.value, tableName)
      case 'number':
        return new UnderlyingNumberColumn(field.id.value, tableName)
      case 'bool':
        return new UnderlyingBoolColumn(field.id.value, tableName)
      case 'date':
        return new UnderlyingDateColumn(field.id.value, tableName)
      case 'date-range':
        return [
          new UnderlyingDateRangeFromColumn(field.id.value, tableName),
          new UnderlyingDateRangeToColumn(field.id.value, tableName),
        ]
      case 'select':
        return new UnderlyingSelectColumn(field.id.value, tableName)
      case 'multi-select':
        return new UnderlyingMultiSelectColumn(field.id.value, tableName)
      case 'qrcode':
        return new UnderlyingQRCodeColumn(field.id.value, tableName)
      case 'collaborator':
        return new UnderlyingCollaboratorColumn(field.id.value, tableName)
      case 'reference':
        return new UnderlyingReferenceColumn(field.id.value, tableName)
      case 'tree':
        return new UnderlyingTreeColumn(field.id.value, tableName)
      case 'parent':
        return new UnderlyingParentColumn(field.id.value, tableName)
      case 'count':
        return new UnderlyingCountColumn(field.id.value, tableName)
      case 'sum':
        return new UnderlyingSumColumn(field.id.value, tableName)
      case 'average':
        return new UnderlyingAverageColumn(field.id.value, tableName)
      case 'lookup':
        return new UnderlyingLookupColumn(field.id.value, tableName)
      case 'created-by':
        return new UnderlyingCreatedByColumn(field.id.value, tableName)
      case 'updated-by':
        return new UnderlyingUpdatedByColumn(field.id.value, tableName)
      case 'min':
        return new UnderlyingMinColumn(field.id.value, tableName)
      case 'max':
        return new UnderlyingMaxColumn(field.id.value, tableName)
    }
  }

  static createMany(fields: Field[], tableName: string): IUnderlyingColumn[] {
    return fields.flatMap((field) => this.create(field, tableName))
  }
}
