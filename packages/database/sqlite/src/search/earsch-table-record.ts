import { Record as CoreRecord, Table } from '@undb/core'
import { SqliteSearchTable } from './search-table'

export class SearchTableRecord {
  public readonly value: Record<string, string>
  constructor(table: Table, record: CoreRecord) {
    const searchableFields = table.schema.searchableFields
    const t = new SqliteSearchTable(table)
    const result: Record<string, string> = {}

    result[t.idField] = record.id.value

    for (const field of searchableFields) {
      const value = record.values.getUnpackedValue(field.id.value).into(null)
      if (value) {
        result[field.id.value] = value.toString()
      }
    }

    this.value = result
  }
}
