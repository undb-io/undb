import type { IFieldValue, IQueryRecordSchema, TableSchemaMap } from '@egodb/core'

export class RecordSqliteMapper {
  // TODO: record type
  static toQuery(tableId: string, schema: TableSchemaMap, data: Record<string, any>): IQueryRecordSchema {
    const { id, created_at, ...rest } = data
    const values: Record<string, IFieldValue> = {}

    for (const [columnName, value] of Object.entries(rest)) {
      if (columnName.endsWith('_from') || columnName.endsWith('_to')) {
        continue
      } else {
        const field = schema.get(columnName)
        if (field) {
          if (field.type === 'date') {
            values[field.id.value] = value ? new Date(value) : null
          } else {
            values[field.id.value] = value
          }
        }
      }
    }

    return {
      id,
      createdAt: new Date(created_at),
      tableId,
      values,
    }
  }
}
