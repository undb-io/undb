import type { IFieldQueryValue, IQueryRecordSchema, IRecordDisplayValues, Record, TableSchemaIdMap } from '@egodb/core'
import { RecordFactory } from '@egodb/core'
import { castArray, mapValues } from 'lodash-es'
import type { Result } from 'oxide.ts'
import {
  getFieldIdFromDateRangeFromColumnName,
  getFieldIdFromDateRangeToColumnName,
  isUnlderlyingDateTangeFromColumn,
  isUnlderlyingDateTangeToColumn,
} from '../../underlying-table/underlying-column.js'
import type { RecordSqlite } from './record.type.js'
import { isExpandColumnName } from './record.util.js'

export class RecordSqliteMapper {
  // TODO: refactor if else logic
  static toQuery(tableId: string, schema: TableSchemaIdMap, data: RecordSqlite): IQueryRecordSchema {
    const { id, created_at, updated_at, auto_increment, ...rest } = data

    const values: globalThis.Record<string, IFieldQueryValue> = {}
    const displayValues: IRecordDisplayValues = {}

    for (const [columnName, value] of Object.entries(rest)) {
      if (isExpandColumnName(columnName)) {
        Object.assign(
          displayValues,
          mapValues(JSON.parse(value), (expanded) => mapValues(expanded, castArray)),
        )
      } else if (isUnlderlyingDateTangeFromColumn(columnName)) {
        const fieldId = getFieldIdFromDateRangeFromColumnName(columnName)
        values[fieldId] ??= []
        ;(values[fieldId] as Array<Date | null>)[0] = value ? new Date(value) : null
      } else if (isUnlderlyingDateTangeToColumn(columnName)) {
        const fieldId = getFieldIdFromDateRangeToColumnName(columnName)
        values[fieldId] ??= []
        ;(values[fieldId] as Array<Date | null>)[1] = value ? new Date(value) : null
      } else {
        const field = schema.get(columnName)
        if (!field) continue

        const fieldId = field.id.value
        if (field.type === 'date') {
          values[fieldId] = value ? new Date(value) : null
        } else if (field.type === 'reference' || field.type === 'tree') {
          values[fieldId] = typeof value === 'string' ? JSON.parse(value) : value
        } else if (field.type === 'bool') {
          values[fieldId] = !!value
        } else {
          values[fieldId] = value
        }
      }
    }

    return {
      id,
      createdAt: new Date(created_at),
      updatedAt: new Date(updated_at),
      autoIncrement: auto_increment,
      tableId,
      values,
      displayValues,
    }
  }

  static toDomain(tableId: string, schema: TableSchemaIdMap, data: RecordSqlite): Result<Record, string> {
    const qr = this.toQuery(tableId, schema, data)
    return RecordFactory.fromQuery(qr, schema)
  }
}
