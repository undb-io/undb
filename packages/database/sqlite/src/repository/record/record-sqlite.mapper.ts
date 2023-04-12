import type {
  IFieldQueryValue,
  IQueryRecords,
  IQueryRecordSchema,
  IRecordDisplayValues,
  Record,
  TableSchemaIdMap,
} from '@undb/core'
import { RecordFactory } from '@undb/core'
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
    const { id, created_at, created_by, updated_at, updated_by, auto_increment, ...rest } = data

    const values: globalThis.Record<string, IFieldQueryValue> = {}
    const displayValues: IRecordDisplayValues = {}

    for (const [columnName, value] of Object.entries(rest)) {
      if (isExpandColumnName(columnName)) {
        Object.assign(
          displayValues,
          mapValues(JSON.parse(value), (expanded) => mapValues(expanded, (v) => castArray(JSON.parse(v)))),
        )
      } else if (isUnlderlyingDateTangeFromColumn(columnName)) {
        const fieldId = getFieldIdFromDateRangeFromColumnName(columnName)
        values[fieldId] ??= []
        ;(values[fieldId] as Array<string | null>)[0] = value ? new Date(value).toISOString() : null
      } else if (isUnlderlyingDateTangeToColumn(columnName)) {
        const fieldId = getFieldIdFromDateRangeToColumnName(columnName)
        values[fieldId] ??= []
        ;(values[fieldId] as Array<string | null>)[1] = value ? new Date(value).toISOString() : null
      } else {
        const field = schema.get(columnName)
        if (!field) continue

        const fieldId = field.id.value
        if (field.type === 'date') {
          values[fieldId] = value ? new Date(value).toISOString() : null
        } else if (
          field.type === 'reference' ||
          field.type === 'tree' ||
          field.type === 'attachment' ||
          field.type === 'collaborator'
        ) {
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
      createdAt: new Date(created_at).toISOString(),
      createdBy: created_by,
      updatedAt: new Date(updated_at).toISOString(),
      updatedBy: updated_by,
      autoIncrement: auto_increment,
      tableId,
      values,
      displayValues,
    }
  }

  static toQueries(tableId: string, schema: TableSchemaIdMap, data: RecordSqlite[]): IQueryRecords {
    return data.map((d) => RecordSqliteMapper.toQuery(tableId, schema, d))
  }

  static toDomain(tableId: string, schema: TableSchemaIdMap, data: RecordSqlite): Result<Record, string> {
    const qr = this.toQuery(tableId, schema, data)
    return RecordFactory.fromQuery(qr, schema)
  }
}
