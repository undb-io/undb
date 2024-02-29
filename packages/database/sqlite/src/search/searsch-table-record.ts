import { Record as CoreRecord } from '@undb/core'
import { SqliteSearchTable } from './search-table.js'

export class SearchTableRecord {
  public readonly value: Record<string, string>
  constructor(table: SqliteSearchTable, record: CoreRecord) {
    const result: Record<string, string> = {}

    for (const field of table.fields) {
      if (field === table.idField) {
        result[field] = record.id.value
      } else {
        const value = record.values.getUnpackedValue(field).into(null)
        if (value) {
          result[field] = value.toString()
        }
      }
    }

    this.value = result
  }
}
