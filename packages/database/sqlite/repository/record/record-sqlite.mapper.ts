import type { IFieldQueryValue, IQueryRecordSchema, Record, TableSchemaIdMap } from '@egodb/core'
import { RecordFactory } from '@egodb/core'
import { castArray, mapValues } from 'lodash'
import type { Result } from 'oxide.ts'
import type { RecordSqlite } from './record.type'

export class RecordSqliteMapper {
  // TODO: record type
  static toQuery(tableId: string, schema: TableSchemaIdMap, data: RecordSqlite): IQueryRecordSchema {
    const { id, created_at, updated_at, auto_increment, expand, ...rest } = data
    const values: globalThis.Record<string, IFieldQueryValue> = {}

    for (const [columnName, value] of Object.entries(rest)) {
      if (columnName.endsWith('_from') || columnName.endsWith('_to')) {
        continue
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
      displayValues: mapValues(JSON.parse(expand), (expanded) => mapValues(expanded, castArray)),
    }
  }

  static toDomain(tableId: string, schema: TableSchemaIdMap, data: RecordSqlite): Result<Record, string> {
    const qr = this.toQuery(tableId, schema, data)
    return RecordFactory.fromQuery(qr, schema)
  }
}
