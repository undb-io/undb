import type {
  IFieldQueryValue,
  IQueryRecords,
  IQueryRecordSchema,
  IRecordDisplayValues,
  ITrashRecordSchema,
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
    const {
      id,
      created_at,
      created_by,
      created_by_profile,
      updated_at,
      updated_by,
      updated_by_profile,
      auto_increment,
      ...rest
    } = data

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
        } else if (field.type === 'multi-select') {
          values[fieldId] = value ? JSON.parse(value) : null
        } else if (
          field.type === 'reference' ||
          field.type === 'tree' ||
          field.type === 'attachment' ||
          field.type === 'collaborator'
        ) {
          values[fieldId] = typeof value === 'string' && !!value ? JSON.parse(value) : value
        } else if (field.type === 'bool') {
          values[fieldId] = !!value
        } else if (field.type === 'json') {
          if (value) {
            try {
              values[fieldId] = JSON.parse(value)
            } catch (error) {
              //
            }
          }
        } else {
          values[fieldId] = value
        }
      }
    }

    return {
      id,
      createdAt: new Date(created_at).toISOString(),
      createdBy: created_by,
      createdByProfile: created_by_profile ? JSON.parse(created_by_profile) : null,
      updatedAt: new Date(updated_at).toISOString(),
      updatedBy: updated_by,
      updatedByProfile: updated_by_profile ? JSON.parse(updated_by_profile) : null,
      autoIncrement: auto_increment,
      tableId,
      values,
      displayValues,
    }
  }

  static toQueries(tableId: string, schema: TableSchemaIdMap, data: RecordSqlite[]): IQueryRecords {
    return data.filter(Boolean).map((d) => RecordSqliteMapper.toQuery(tableId, schema, d))
  }

  static toDomain(tableId: string, schema: TableSchemaIdMap, data: RecordSqlite): Result<Record, string> {
    const qr = this.toQuery(tableId, schema, data)
    return RecordFactory.fromQuery(qr, schema)
  }

  static toTrash(tableId: string, schema: TableSchemaIdMap, data: RecordSqlite): ITrashRecordSchema {
    const query = this.toQuery(tableId, schema, data)
    return {
      ...query,
      deletedAt: new Date(data.deleted_at).toISOString(),
      deletedBy: data.deleted_by,
      deletedByProfile: data.deleted_by_profile ? JSON.parse(data.deleted_by_profile) : null,
    }
  }

  static toTrashes(tableId: string, schema: TableSchemaIdMap, data: RecordSqlite[]): ITrashRecordSchema[] {
    return data.filter(Boolean).map((d) => RecordSqliteMapper.toTrash(tableId, schema, d))
  }
}
