import { Table } from '@undb/core'

export class SqliteSearchTable {
  constructor(private readonly table: Table) {}

  public get name() {
    return `undb_search_${this.table.id.value}`
  }

  public get idField() {
    return 'id'
  }

  public getCreateFT5Query(): string {
    const searchableFields = this.table.schema.searchableFields
    const fieldNames = searchableFields
      .map((f) => f.id.value)
      .concat(this.idField)
      .map((f) => `'${f}'`)
      .join(', ')

    return `CREATE VIRTUAL TABLE ${this.name} USING fts5(${fieldNames});`
  }
}
