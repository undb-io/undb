import type { IFieldValue, IQueryRecordSchema, Record, TableSchemaMap } from '@egodb/core'
import { RecordFactory } from '@egodb/core'
import type { Result } from 'oxide.ts'

export class RecordSqliteMapper {
  // TODO: record type
  static toQuery(tableId: string, schema: TableSchemaMap, data: globalThis.Record<string, any>): IQueryRecordSchema {
    const { id, created_at, updated_at, ...rest } = data
    const values: globalThis.Record<string, IFieldValue> = {}

    for (const [columnName, value] of Object.entries(rest)) {
      if (columnName.endsWith('_from') || columnName.endsWith('_to')) {
        continue
      } else {
        const field = schema.get(columnName)
        if (field) {
          if (field.type === 'date') {
            values[field.key.value] = value ? new Date(value) : null
          } else if (field.type === 'bool') {
            values[field.key.value] = !!value
          } else {
            values[field.key.value] = value
          }
        }
      }
    }

    return {
      id,
      createdAt: new Date(created_at),
      updatedAt: new Date(updated_at),
      tableId,
      values,
    }
  }

  static toDomain(
    tableId: string,
    schema: TableSchemaMap,
    data: globalThis.Record<string, any>,
  ): Result<Record, string> {
    const qr = this.toQuery(tableId, schema, data)
    return RecordFactory.fromQuery(qr, schema)
  }
}
